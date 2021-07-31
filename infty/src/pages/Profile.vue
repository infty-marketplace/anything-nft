<template>
  <div class="personalCenter">
	<Navbar />
    <el-container>
      <el-header>My Profile</el-header>
      <el-container>
        <el-aside width="400px">
          <el-col :span="12">
            <div class="sub-title"></div>
            <div class="demo-basic--circle">
              <div class="img">
                <el-avatar
                  :size="100"
                  :src="circleUrl"
                  align="center"
                ></el-avatar>
              </div>
              <div class="block">
                <span>ADMIN</span>
              </div>
            </div>
          </el-col>
          <el-input
            v-model="input1"
            type="text"
            placeholder="User ID"
            maxlength="6"
            show-word-limit
          ></el-input>
          <el-input
            v-model="input2"
            type="text"
            placeholder="User NickName"
            show-word-limit
          ></el-input>
          <el-input
            v-model="input3"
            type="text"
            placeholder="User NickName"
            show-word-limit
          ></el-input>
          <el-input
            v-model="input4"
            placeholder="Input Password"
            show-password
          ></el-input>
          <el-input
            v-model="input5"
            type="text"
            placeholder="User Name"
            show-word-limit
          ></el-input>
          <el-input
            v-model="input6"
            type="text"
            placeholder="priority"
            maxlength="2"
            show-word-limit
          ></el-input>
          <el-input v-model="input7" placeholder="email address">
            <template slot="append">@163.com</template>
          </el-input>
          <el-input
            v-model="input8"
            type="text"
            placeholder="number"
            maxlength="20"
            show-word-limit
          ></el-input>
          <el-input
            v-model="input9"
            type="text"
            placeholder="number 2"
            maxlength="20"
            show-word-limit
          ></el-input>
          <el-button-group style="float: right; padding: 3px 0" type="text">
            <el-button type="primary" size="medium" round>保存</el-button>
          </el-button-group>
        </el-aside>
        <el-container>
          <el-main>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span style="float: left"><b>bind your account</b></span>
                <el-button-group
                  style="float: right; padding: 3px 0"
                  type="text"
                >
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="medium"
                    round
                  >
                    edit your info
                  </el-button>
                  <el-button
                    type="primary"
                    icon="el-icon-check"
                    size="medium"
                    round
                  >
                    confirm edit
                  </el-button>
                </el-button-group>
              </div>
              <div v-for="o in 1" :key="o" class="text item">
                <el-table :data="tableData" style="width: 100%">
                  <el-table-column label="account id" width="180">
                    <template slot-scope="scope">
                      <p>{{ scope.row.name1 }}</p>
                      <div slot="reference" class="name-wrapper"></div>
                    </template>
                  </el-table-column>
                  <el-table-column label="options" align="center">
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        @click="handleEdit(scope.$index, scope.row)"
                      >
                        edit
                      </el-button>
                      <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)"
                      >
                        unbind your account
                      </el-button>
                    </template>
                  </el-table-column>
                  <el-table-column label="more..." align="center">
                    <el-row>
                      <el-button
                        type="info"
                        icon="el-icon-message"
                        circle
                      ></el-button>
                      <el-button
                        type="warning"
                        icon="el-icon-star-off"
                        circle
                      ></el-button>
                      <el-button
                        type="share"
                        icon="el-icon-share"
                        circle
                      ></el-button>
                    </el-row>
                  </el-table-column>
                </el-table>
              </div>
              <div v-for="o in 1" :key="o" class="text item">
                <el-table :data="tableData" style="width: 100%">
                  <el-table-column label="account id" width="180">
                    <template slot-scope="scope">
                      <p>{{ scope.row.name2 }}</p>
                      <div slot="reference" class="name-wrapper"></div>
                    </template>
                  </el-table-column>
                  <el-table-column label="operation" align="center">
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        @click="handleEdit(scope.$index, scope.row)"
                      >
                        edit
                      </el-button>
                      <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)"
                      >
                        unbind your account
                      </el-button>
                    </template>
                  </el-table-column>
                  <el-table-column label="更多" align="center">
                    <el-row>
                      <el-button
                        type="info"
                        icon="el-icon-message"
                        circle
                      ></el-button>
                      <el-button
                        type="warning"
                        icon="el-icon-star-off"
                        circle
                      ></el-button>
                      <el-button
                        type="share"
                        icon="el-icon-share"
                        circle
                      ></el-button>
                    </el-row>
                  </el-table-column>
                </el-table>
              </div>
            </el-card>
            <el-card class="box-card">
              <div>
                <span style="float: left" shadow="hover"><b>personal info</b></span>
                <br />
                <br />
                <span>Hi</span>
                <el-divider></el-divider>
                <span>This is a test message</span>
                <el-divider></el-divider>
                <span>Nice to meet you!</span>
              </div>
            </el-card>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
	<Footer />
  </div>
</template>
<script>
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
  
  
	export default {
	name: 'Profile',
	components: {
		Navbar,
		Footer
		},
	data() {
		return {
		text: '',
		input1: '',
		input2: '',
		input3: '',
		input4: '',
		input5: '',
		input6: '',
		input7: '',
		input8: '',
		input9: '',
		circleUrl:
		'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
		sizeList: ['large'],
		tableData: [
		{
			date: '2016-05-03',
			name1: 'Wechat',
			name2: 'Github',
		},
		],
	}
	},
	methods: {
	handleEdit(index, row) {
		console.log(index, row)
	},
	handleDelete(index, row) {
		console.log(index, row)
	},
	},
}
</script>
<style>
  .content {
	min-width: 60vw;
	margin: 0px auto;
  }
  .main {
    background-color: #f8f8f9;
  }
  .create-btn {
    float: right;
  }
  .el-header {
    line-height: 60px;
    text-align: center;
    background-color: #b3c0d1;
  }
  .el-aside {
    line-height: 44px;
    text-align: center;
    background-color: #d3dce6;
  }
  .el-main {
    line-height: 36px;
    text-align: center;
    background-color: #e9eef3;
  }

  .demo-basic--circle {
    align: 'center';
    margin-top: 30px;
    margin-left: 150px;
  }
  .block {
    margin-left: 25px;
    font-weight: bold;
  }
  .text {
    font-size: 14px;
  }
  .item {
    margin-bottom: 18px;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: '';
  }
  .clearfix:after {
    clear: both;
  }

  .box-card {
    width: 1368px;
    border-radius: 30px;
  }
</style>
