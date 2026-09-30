const express=require("express"),mongoose=require("mongoose"),cors=require("cors"),path=require("path");
const {MONGODB_URI,DB_NAME,ADMIN}=require("./config"),Mandal=require("./models/Mandal");
const app=express(),PORT=process.env.PORT||10000;
app.use(cors());app.use(express.json({limit:"10mb"}));app.use(express.urlencoded({extended:true,limit:"10mb"}));app.use(express.static(path.join(__dirname,"public")));
async function db(){try{await mongoose.connect(MONGODB_URI,{dbName:DB_NAME});console.log("MongoDB connected")}catch(e){console.error("MongoDB connection failed:",e.message);process.exit(1)}}
const auth=(req,res,next)=>{if(req.headers["x-admin-user"]===ADMIN.username&&req.headers["x-admin-password"]===ADMIN.password)return next();res.status(401).json({success:false,message:"Unauthorized"})};
app.get("/api/health",(q,r)=>r.json({success:true,mongodb:mongoose.connection.readyState===1?"connected":"disconnected"}));
app.get("/api/mandals",async(q,r)=>{try{r.json({success:true,data:await Mandal.find({active:true}).sort({createdAt:-1}).lean()})}catch(e){r.status(500).json({success:false,message:"Unable to load Mandals"})}});
app.get("/api/mandals/:id",async(q,r)=>{try{const m=await Mandal.findById(q.params.id).lean();if(!m)return r.status(404).json({success:false,message:"Mandal not found"});r.json({success:true,data:m})}catch(e){r.status(500).json({success:false,message:"Unable to load Mandal"})}});
app.post("/api/admin/login",(q,r)=>{const{username,password}=q.body;if(username===ADMIN.username&&password===ADMIN.password)return r.json({success:true});r.status(401).json({success:false,message:"Invalid username or password"})});
app.get("/api/admin/mandals",auth,async(q,r)=>r.json({success:true,data:await Mandal.find().sort({createdAt:-1}).lean()}));
app.post("/api/admin/mandals",auth,async(q,r)=>{try{r.status(201).json({success:true,data:await Mandal.create(q.body)})}catch(e){r.status(400).json({success:false,message:e.message})}});
app.put("/api/admin/mandals/:id",auth,async(q,r)=>{try{const m=await Mandal.findByIdAndUpdate(q.params.id,q.body,{new:true,runValidators:true});if(!m)return r.status(404).json({success:false,message:"Mandal not found"});r.json({success:true,data:m})}catch(e){r.status(400).json({success:false,message:e.message})}});
app.delete("/api/admin/mandals/:id",auth,async(q,r)=>{try{await Mandal.findByIdAndDelete(q.params.id);r.json({success:true})}catch(e){r.status(500).json({success:false,message:"Delete failed"})}});
app.get("/admin",(q,r)=>r.sendFile(path.join(__dirname,"public","admin.html")));
app.get("*",(q,r)=>r.sendFile(path.join(__dirname,"public","index.html")));
db().then(()=>app.listen(PORT,"0.0.0.0",()=>console.log("Mandal Locator on",PORT)));