<template>
  <div class="home">
    <div v-if="selected === null">
      <h1>Your Projects</h1>
      
      <span>Show: </span>
      <select v-model="viewOption" @change="this.getProjects">
        <option value="All">All</option>
        <option value="Incomplete">Incomplete</option>
        <option value="Complete">Complete</option>
      </select>
      <br/>
      <br/>

      <section class="projects">
        <div class="project" 
        v-for="proj in projects" :key="proj.id">
          <div class="opts">
            <div class="opts-abs">
              <i @click="editProject(proj)" class="fas fa-edit"></i>
              <i @click="deleteProject(proj)" class="fas fa-trash-alt"></i>
            </div>
          </div>
          <div @click="viewProgress(proj)">
            <h3>{{proj.name}}</h3>
            <p>{{proj.desc}}</p>
            <div class="date">
              <span>Start: </span>{{proj.start}}
            </div>
            <div class="date">
              <span>End: </span>{{proj.end}}
            </div>  
          </div>
        </div>
      </section>

      <br/>
      <button @click="newProject">New Project</button>

      <div class="add" v-if="viewAdd">
        <div class="form">
          <div>
            <input v-model="name" placeholder="Name">
          </div>
          
          <textarea v-model="desc" placeholder="Description"/>

          <div class="date">
            <span>Start Date: </span>
            <input type="date" v-model="start">
          </div>

          <div class="date">
            <span>End Date: </span>
            <input type="date" v-model="end">
          </div>
          
          <div>
            <button @click="submitProject">Submit</button>
            <button @click="close">Cancel</button>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <Progress :project="selected" />
    </div>
  </div>
</template>

<script>
import Progress from '../components/Progress'
import axios from 'axios'
const ax = axios.create({baseURL: 'http://localhost:3000'})

export default {
  name: 'Home',
  data() {
    return {
      projects: [],
      selected: null,
      viewAdd: false,
      id: "",
      name: "",
      desc: "",
      start: "",
      end: "",
      viewOption: "All"
    }
  },
  components: {
    Progress
  },
  created() {
    this.getProjects();
  },
  methods: {
    viewProgress(proj) {
      this.selected = proj
      // window.open(window.location.href + 'progress', '_self')
    },
    newProject() {
      this.viewAdd = true;
    },
    close() {
      this.id = ""
      this.name = ""
      this.desc = ""
      this.start = ""
      this.end = ""
      this.viewAdd = false;
    },
    async submitProject() {
      if (this.id === "") {
        this.submitNew()
      } else {
        this.submitEdit()
      }
      this.close()
    },
    async submitNew() {
      try {
        await ax.post('/api/project', {
          name: this.name,
          desc: this.desc,
          start: this.start,
          end: this.end
        })
        this.getProjects()
      } catch (err) {
        console.log(err)
      }
    },
    async submitEdit() {
      try {
        await ax.put('/api/project/' + this.id, {
          name: this.name,
          desc: this.desc,
          start: this.start,
          end: this.end
        })
        this.getProjects()
      } catch (err) {
        console.log(err)
      }
    },
    async getProjects() {
      try {
        let response = await ax.get("/api/project/" + this.viewOption)
        this.projects = response.data;
        this.projects.forEach((proj) => {
          if (proj.start != null) {
            proj.start = proj.start.substring(0,10)
          }
          if (proj.end != null) {
            proj.end = proj.end.substring(0,10)
          }
        })
        return true
      } catch (err) {
        console.log(err);
      }
    },
    async deleteProject(proj) {
     try {
        await ax.delete("/api/project/" + proj._id);
        this.getProjects();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async editProject(proj) {
      this.viewAdd = true
      this.id = proj._id
      this.name = proj.name
      this.desc = proj.desc
      this.start = proj.start
      this.end = proj.end
    }
  }
}
</script>

<style scoped>

.projects {
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 80%;
  justify-content: center;
}
.project {
  display: flex;
  flex-direction: column;
  width: 200px;
  background: #52796f;
  border-radius: 10px;
  padding: 0 10px 10px 10px;
  color: #e6ece2;
  cursor: pointer;
  margin-right: 15px;
  margin-bottom: 15px;
}
.project:hover {
  background: #354f52;
  color: #a9ada6;
  transition-duration: .25s;
}
.project p {
  margin: 0 0 15px 0
}
.opts {
  display: none;
  position: relative;
  width: fit-content;
  font-size: 16px;
  color: #e6ece2;
  transition-duration: .25s;
}
.opts-abs {
  position: absolute;
  width: 45px;
  left: -4px;
  top: 4px;
}
.opts i {
  margin-right: 2px;
}
.project:hover .opts {
  display: block;
  transition-duration: .25s;
}
.opts i:hover {
  font-size: 20px;
  transition-duration: .25s;
}
.date span {
  font-weight: bold;
}

.add {
  position: fixed;
  background: #84a98c;
  padding: 15px;
  margin: auto;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px;
  width: 300px;
  height: 400px;
}

.add .form {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-around;
}
</style>