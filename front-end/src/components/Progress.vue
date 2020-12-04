<template>
  <div class="progress" v-if="this.project != null" @change="this.getProgress">
    <p class="link" @click="closeProgress">View Projects</p>
    <h1>{{project.name}}</h1>
    <p class="description">{{project.desc}}</p>
    <hr>

    <button @click="viewModule">New Entry</button>

    <table class="progress-list">
      <tr> 
        <th>Date</th>
        <th>Progress</th>
        <th></th>
      </tr>
      <tr v-for="prog in progressList" :key="prog._id">
        <td>{{prog.date}}</td>
        <td>{{prog.desc}}</td>
        <td><i @click="editProgress(prog)" class="fas fa-edit"/>
        <i @click="deleteProgress(prog)" class="fas fa-trash-alt"/></td>
      </tr>
    </table>


    <div class="add" v-if="viewAdd">
      <div class="form">
        <div>
          <span>Date: </span>
          <input type="date" v-model="date" />
        </div>
        <textarea v-model="desc" placeholder="Progress" />
        <div>
          <button @click="submitProgress">Submit</button>
          <button @click="closeModule">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
const ax = axios.create({baseURL: 'http://localhost:3000'})

export default {
  props: {
    project: Object
  }, 
  data() {
    return {
      // project: this.props.project,
      progressList: [],
      viewAdd: false,
      date: "",
      desc: "",
      id: ""
    }
  },
  created() { 
    this.getProgress()
  },
  watch: {
    project: function() { this.getProgress() }
  },
  methods: {
    closeProgress() {
      window.location.reload(true)
    },
    viewModule() {
      this.viewAdd = true
    },
    closeModule() {
      this.viewAdd = false
      this.date = ''
      this.desc = ''
      this.id = ''
    },
    async getProgress() {
      if (this.project != null) {
        try {
          let response = await ax.get('/api/progress/' + this.project._id)
          this.progressList = response.data
          this.progressList.forEach((prog) => {
            if (prog.date != null) {
              prog.date = prog.date.substring(0,10)
            }
          })
          this.progressList = this.progressList.sort((a, b) => {
            a = new Date(a.date)
            b = new Date(b.date)
            return a.getTime() - b.getTime()
          })
          return true
        } catch (err) {
          console.log(err)
        }
      }
    },
    async submitProgress() {
      if (this.id === '') {
        this.submitNew()
      } else {
        this.submitEdit()
      }
      this.closeModule()
    },
    async submitNew() {
      try {
        await ax.post('api/progress', {
          proj: this.project._id,
          date: this.date,
          desc: this.desc
        })
        this.getProgress()
      } catch (err) {
        console.log(err)
      }
    },
    async submitEdit() {
      try {
        await ax.put('api/progress/' + this.id, {
          proj: this.project._id,
          date: this.date,
          desc: this.desc
        })
        this.getProgress()
      } catch (err) {
        console.log(err)
      }
    },
    async editProgress(prog) {
      this.date = prog.date
      this.desc = prog.desc
      this.id = prog._id
      this.viewModule()
    },
    async deleteProgress(prog) {
      try {
        await ax.delete('api/progress/' + prog._id)
        this.getProgress()
        return true;
      } catch(err) {
        console.log(err)
      }
    }
  }
}
</script>

<style scoped>
.link {
  text-decoration: underline;
  color: #52796f;
  cursor: pointer;
}
.description {
  width: 80%;
  margin: auto;
}
.progress-list {
  margin: 15px auto;
  color: #cad2c5;
  max-width: 80%;
}
th {
  background: #354f52;
}
td {
  background: #52796f;
  color: white;
}
td, th {
  padding: 5px;
  text-align: left;
}
i:hover {
  font-size: 20px;
  transition-duration: .25s;
  cursor: pointer;
}
th:nth-child(1) {
  width: 85px;
}
th:nth-child(2) {
  min-width: 200px;
}
th:nth-child(3) {
  width: 40px;
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
  height: 250px;
}
.add .form {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-around;
}
</style>