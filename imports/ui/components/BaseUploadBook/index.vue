<template>
  <div>
    <div v-loading="isLoading">
      <UploadButton @add="uploadFile" />
      <span>
        {{ trunc(book.name, 30) }}
      </span>
    </div>
    <el-image
      :src="book.cover"
      :fit="'fill'"
      style="width: 100px; height: auto"
    >
      <div slot="error" class="image-slot">
        <el-image src="default-cover.png" :fit="'fill'"> </el-image>
      </div>
    </el-image>
    <!-- <el-input
      v-model="$attrs.value"
      @input="(value) => $emit('input', value)"
    /> -->
  </div>
</template>

<script>
import _ from "lodash";
import SparkMD5 from "spark-md5";
import ePub from "epubjs";
import BookModel from "./BookModel";
import UploadButton from "./UploadButton";
import UserFiles from "../../../features/books/app/collections";
export default {
  props: ['value'],
  components: {
    UploadButton,
  },
  data() {
    return {
      isLoading: true,
      book: {
        cover: null,
        name: "未上传",
      },
    };
  },
  mounted() {
    // debugger
    if (this.value) {
      Meteor.call(
        "books.findOne",
        {
          _id: this.value,
        },
        (err, res) => {
          this.isLoading = false;
          if (err) {
            this.$message.error(err);
            return;
          }
          // debugger
          this.book = res;
        }
      );
    } else {
      this.isLoading = false;
    }
  },
  methods: {
    trunc(str, n) {
      return str.length > n ? `${str.substr(0, n - 3)}...` : str;
    },
    // 上传书籍
    uploadFile(files) {
      if (files) {
        let uploadInstance = UserFiles.insert(
          {
            file: files[0],
            meta: {
              userId: Meteor.userId(),
            },
            chunkSize: "dynamic",
            allowWebWorkers: true,
          },
          false
        );
        uploadInstance.on("uploaded", (error, fileObj) => {
          if (error) {
            return;
          }
          if (window.FileReader) {
            // 将文件转换成Epub格式的文件
            this.getMd5WithBrowser(files[0], fileObj._id);
          }
        });
        uploadInstance.on("error", (error, fileObj) => {
          alert(error);
        });
        uploadInstance.start();
      }
    },
    // 转化为File格式的文件
    getMd5WithBrowser(file, id) {
      return new Promise((resolve, reject) => {
        var blobSlice =
            File.prototype.slice ||
            File.prototype.mozSlice ||
            File.prototype.webkitSlice,
          chunkSize = 2097152, // 以每片2MB大小来逐次读取
          chunks = Math.ceil(file.size / chunkSize),
          currentChunk = 0,
          spark = new SparkMD5(), //创建SparkMD5的实例
          fileReader = new FileReader();
        fileReader.onload = async (e) => {
          if (!e.target) {
            reject();
            throw new Error();
          }
          spark.appendBinary(e.target.result); // append array buffer
          currentChunk += 1;
          if (currentChunk < chunks) {
            loadNext();
          } else {
            let md5 = spark.end(); // 完成计算，返回结果
            await this.handleBook(file, md5, id);
            resolve();
          }
        };

        const loadNext = () => {
          var start = currentChunk * chunkSize,
            end =
              start + chunkSize >= file.size ? file.size : start + chunkSize;
          fileReader.readAsBinaryString(blobSlice.call(file, start, end));
        };

        loadNext();
      });
    },
    // 处理文件
    handleBook(file, md5, id) {
      let extension = file.name.split(".").reverse()[0];
      let bookName = file.name.substr(
        0,
        file.name.length - extension.length - 1
      );
      return new Promise((resolve, reject) => {
        Meteor.call(
          "books.find",
          {
            md5,
            name: bookName,
          },
          (err, result) => {
            if (err) {
              return this.$message.error(err);
            }
            if (result.length !== 0) {
              return this.$message.error("书籍名已经存在");
            }
            let reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = async (e) => {
              if (!e.target) {
                reject();
                throw new Error();
              }
              let cover = "";
              const epub = ePub(e.target.result, "binary");
              epub.loaded.metadata
                .then((metadata) => {
                  if (!e.target) {
                    reject();
                    throw new Error();
                  }
                  epub
                    .coverUrl()
                    .then(async (url) => {
                      if (url) {
                        var reader = new FileReader();
                        let blob = await fetch(url).then((r) => r.blob());
                        reader.readAsDataURL(blob);
                        reader.onloadend = async () => {
                          cover = reader.result;
                          let key, name, author, description, publisher;
                          [name, author, description, publisher] = [
                            metadata.title,
                            metadata.creator,
                            metadata.description,
                            metadata.publisher,
                          ];
                          let format = "EPUB";
                          key = new Date().getTime() + "";

                          let book = new BookModel(
                            key,
                            name,
                            author,
                            description,
                            md5,
                            cover,
                            format,
                            publisher
                          );
                          console.log("key");
                          this.handleAddBook(book, id);
                          resolve();
                        };
                      } else {
                        cover = "noCover";
                        let key, name, author, publisher, description;
                        [name, author, description, publisher] = [
                          metadata.title,
                          metadata.creator,
                          metadata.description,
                          metadata.publisher,
                        ];
                        let format = "EPUB";
                        key = new Date().getTime() + "";
                        let book = new BookModel(
                          key,
                          name,
                          author,
                          description,
                          md5,
                          cover,
                          format,
                          publisher
                        );
                        this.handleAddBook(book, id);
                        // BookUtil.addBook(key, e.target
                        //   .result);
                        resolve();
                      }
                    })
                    .catch((err) => {
                      console.log(err, "err");
                      reject();
                    });
                })
                .catch(() => {
                  console.log("Error occurs");
                  reject();
                });
            };
          }
        );
      });
    },
    // 添加Book到数据库
    handleAddBook(book, id) {
      return new Promise((resolve, reject) => {
        Meteor.call(
          "books.add",
          {
            fileId: id,
            ...book,
          },
          (err, res) => {
            if (err) {
              return this.$message.error(err);
            }
            this.book = book;
            this.$emit("input", res);
            this.$message.success("添加成功成功");
          }
        );
      });
    },
  },
};
</script>

<style></style>
