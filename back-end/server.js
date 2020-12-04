const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
var cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}))
app.use(cors({origin: 'http://localhost:8080'}));


mongoose.connect('mongodb://localhost:27017/projects', {
	useNewUrlParser: true
})


const projSchema = new mongoose.Schema({
	name: String,
	desc: String,
	start: Date,
	end: Date
});
const progSchema = new mongoose.Schema({
	project: String,
	desc: String,
	date: Date
})

const Proj = mongoose.model('Proj', projSchema);
const Prog = mongoose.model('Prog', progSchema)

app.listen(3000, () => console.log('Server listening on port 3000!'));

app.post('/api/project', async(req, res) => {
	const proj = new Proj({
		name: req.body.name,
		desc: req.body.desc,
		start: req.body.start,
		end: req.body.end
	});
	try {
		await proj.save();
		res.send(proj);
	} catch(error) {
		console.log(error)
		res.sendStatus(500)
	}
});

app.get('/api/project/:option', async(req, res) => {
	try {
		let projects = null
		if (req.params.option === "Incomplete") {
			projects = await Proj.find({end: null});
		} else if (req.params.option === "Complete") {
			projects = await Proj.find({end: {$ne:null}})
		} else {
			projects = await Proj.find()
		}

		res.send(projects);
	} catch (err) {
		console.log(err)
		res.sendStatus(500)
	}
})

app.delete('/api/project/:id', async(req, res) => {
	try {
		await Proj.deleteOne({_id:req.params.id})
		res.sendStatus(200)
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
})

app.put("/api/project/:id", async(req, res) => {
	try {
		let proj = await Proj.findOne({_id:req.params.id})
		proj.name = req.body.name
		proj.desc = req.body.desc
		proj.start = req.body.start
		proj.end = req.body.end
		await proj.save()
		res.sendStatus(200)
	} catch (error) {
		console.log(error);
		res.sendStatus(500)
	}
})

app.get('/api/progress/:project', async(req, res) => {
	try {
		let progList = await Prog.find({project:req.params.project})
		res.send(progList)
	} catch (err) {
		console.log(err)
		res.sendStatus(500)
	}
})

app.post('/api/progress', async(req, res) => {
	const prog = new Prog({
		project: req.body.proj,
		date: req.body.date,
		desc: req.body.desc
	})
	try {
		await prog.save()
		res.send(prog)
	} catch (err) {
		console.log(err)
		res.sendStatus(500)
	}
})

app.put('/api/progress/:id', async(req, res) => {
	try {
		const prog = await Prog.findById(req.params.id)
		prog.date = req.body.date
		prog.desc = req.body.desc
		await prog.save()
		res.sendStatus(200)
	} catch (err) {
		console.log(err)
		res.sendStatus(500)
	}
})

app.delete('/api/progress/:id', async(req, res) => {
	try {
		await Prog.deleteOne({_id: req.params.id})
		res.sendStatus(200)
	} catch(err) {
		console.log(err)
		res.sendStatus(500)
	}
})