<template>
  <div class="drag-area">
    <div class="icon"><i class="fas fa-cloud-upload-alt"></i></div>
    <header>Drag & Drop to Upload File</header>
    <span>OR</span>
    <button @click="btnClicked">Browse File</button>
    <input type="file" @change="onUpload" hidden>
  </div>
</template>

<script>
export default {
  name: 'FileUploader',
  data: () => ({
      dropArea: undefined,
      dragText: undefined,
      button: undefined,
      input: undefined,
      file: undefined
  }),
  mounted() {
    const dropArea = document.querySelector(".drag-area");
    const dragText = dropArea.querySelector("header");
    // const button = this.dropArea.querySelector("button"),
    this.input = dropArea.querySelector("input");
    this.dropArea = dropArea;
    this.dragText = dragText;

    dropArea.addEventListener("dragover", (event)=>{
        event.preventDefault(); //preventing from default behaviour
        dropArea.classList.add("active");
        dragText.textContent = "Release to Upload File";
    });
    dropArea.addEventListener("dragleave", ()=>{
        dropArea.classList.remove("active");
        dragText.textContent = "Drag & Drop to Upload File";
    });
    dropArea.addEventListener("drop", (event)=>{
        event.preventDefault(); //preventing from default behaviour
        this.file = event.dataTransfer.files[0];
        this.showFile(); //calling function
    });
  },
  methods: {
      btnClicked() {
          this.input.click();
      },
      onUpload() {
        this.file = this.input.files[0];
        this.dropArea.classList.add("active")
        this.showFile();
      },
      showFile() {
        let fileType = this.file.type; //getting selected file type
        let validExtensions = ["image/jpeg", "image/jpg", "image/png"]; //adding some valid image extensions in array
        if(validExtensions.includes(fileType)){ //if user selected file is an image file
            let fileReader = new FileReader(); //creating new FileReader object
            fileReader.onload = ()=>{
            let fileURL = fileReader.result; //passing user file source in fileURL variable
            let imgTag = `<img src="${fileURL}" alt="image">`; //creating an img tag and passing user selected file source inside src attribute
            this.dropArea.innerHTML = imgTag; //adding that created img tag inside dropArea container
            }
            fileReader.readAsDataURL(this.file);
        }else{
            alert("This is not an Image File!");
            this.dropArea.classList.remove("active");
            this.dragText.textContent = "Drag & Drop to Upload File";
        }
      }
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap');
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}
body{
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #5256ad;
}
.drag-area{
  position: relative;
  border: 2px dashed rgb(100, 100, 100);
  height: 500px;
  width: 700px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.drag-area.active{
  border: 2px solid rgb(226, 226, 226);
}
.drag-area .icon{
  font-size: 100px;
  color: rgb(100, 100, 100);
}
.drag-area header{
  font-size: 30px;
  font-weight: 500;
  color: rgb(100, 100, 100);
}
.drag-area span{
  font-size: 25px;
  font-weight: 500;
  color: rgb(100, 100, 100);
  margin: 10px 0 15px 0;
}
.drag-area button{
  padding: 10px 25px;
  font-size: 20px;
  font-weight: 500;
  border: none;
  outline: none;
  background: rgb(125, 203, 255);
  color: #ffffff;
  border-radius: 5px;
  cursor: pointer;
}

</style>

<style>
.drag-area img{
  height: 100%;
  width: 100%;
  object-fit: cover;
  border-radius: 5px;
}
</style>