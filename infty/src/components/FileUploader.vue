<template>
  <div>
    <div class="drag-area">
      <input ref='input' type="file" accept=".jpg,.jpeg,.png" @change="onUpload" hidden />
      <img style="object-fit: contain" ref='image' v-if="fileLoaded"/>
      <div class='drag-area-inner mt-5' v-else>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="150"
        height="200"
        fill="grey"
        class="bi bi-cloud-upload"
        viewBox="0 0 16 16"
      >
        <path
          fill-rule="evenodd"
          d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z"
        />
        <path
          fill-rule="evenodd"
          d="M7.646 4.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V14.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3z"
        />
      </svg>
      <header>{{ $t('fileUploader.upload') }}</header>
      <span>{{ $t('fileUploader.or') }}</span>
      <button v-if="!fileLoaded" @click="btnClicked">{{ $t('fileUploader.browseFile') }}</button>
      </div>
    </div>
    <button v-if="fileLoaded" @click="btnClicked" style="float: right">
      {{ $t('fileUploader.changeFile') }}
    </button>
  </div>
</template>

<script>
import { eventBus } from "../main"

export default {
  name: "FileUploader",
  props: ["passFileToEvent"],
  data: () => ({
    dropArea: undefined,
    dragText: undefined,
    input: undefined,
    file: undefined,
    fileLoaded: false,
    validExtensions: ["image/jpeg", "image/jpg", "image/png"],
  }),
  created() {
    eventBus.$on("CreatePage.nftCreated", () => {
      this.fileLoaded = false;
    })
  },
  mounted() {
    const dropArea = document.querySelector(".drag-area");
    const dragText = dropArea.querySelector("header");
    this.dropArea = dropArea;
    this.dragText = dragText;

    dropArea.addEventListener("dragover", (event) => {
      event.preventDefault(); //preventing from default behaviour
      dropArea.classList.add("active");
      dragText.textContent = "Release to Upload File";
    });
    dropArea.addEventListener("dragleave", () => {
      dropArea.classList.remove("active");
      dragText.textContent = "Drag & Drop to Upload File";
    });
    dropArea.addEventListener("drop", (event) => {
      event.preventDefault(); //preventing from default behaviour
      this.file = event.dataTransfer.files[0];
      this.fileLoaded = true;
      this.showFileOrAlert(this.file.type); //getting selected file type
    });
  },
  methods: {
    btnClicked() {
      this.$refs.input.click();
    },
    onUpload() {
      this.file = this.$refs.input.files[0];
      this.dropArea.classList.add("active");
      this.showFileOrAlert(this.file.type);
    },
    showFileOrAlert(fileType) {
      if (this.validExtensions.includes(fileType)) {
        this.fileLoaded = true;
        this.showFile();
        eventBus.$emit(this.passFileToEvent, this.file)
      } else {
        alert("This is not an Image File!");
        this.dropArea.classList.remove("active");
        this.dragText.textContent = "Drag & Drop to Upload File";
      }
    },
    showFile() {
      //if user selected file is an image file
      let fileReader = new FileReader(); //creating new FileReader object
      fileReader.onload = () => {
        let fileURL = fileReader.result; //passing user file source in fileURL variable
        // this.dropArea.innerHTML = imgTag; //adding that created img tag inside dropArea container
        this.$refs.image.src = fileURL
      };
      fileReader.readAsDataURL(this.file);
    },
  },
  beforeDestroy() {
    eventBus.$off("CreatePage.nftCreated")
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap");

.drag-area {
  position: relative;
  border: 2px dashed rgb(100, 100, 100);
  height: 100%;
  border-radius: 5px;
}
.drag-area-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.drag-area.active {
  border: 2px solid rgb(226, 226, 226);
}
.drag-area .icon {
  font-size: 100px;
  color: rgb(100, 100, 100);
}
.drag-area header {
  font-size: 30px;
  font-weight: 500;
  color: rgb(100, 100, 100);
}
.drag-area span {
  font-size: 25px;
  font-weight: 500;
  color: rgb(100, 100, 100);
  margin: 10px 0 15px 0;
}
.drag-area button {
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
.drag-area img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  border-radius: 5px;
}
</style>