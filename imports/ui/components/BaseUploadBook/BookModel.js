class Book {
	constructor(
	  key,
	  name,
	  author,
	  description,
	  md5,
	  cover,
	  format,
	  publisher,
	  toc,
	  locations
	) {
	  this.key = key; // 数据库的键
	  this.name = name; // 书籍名
	  this.author = author; // 作者
	  this.description = description; // 书籍的描述
	  this.md5 = md5; //epub的md5值，防止重复导入
	  this.cover = cover;
	  this.format = format;
	  this.publisher = publisher;
	  this.toc = toc;
	  this.locations = locations;
	  this.bookmarks = [];
	  this.highlights = [];
	}
  }
  
  export default Book;
  