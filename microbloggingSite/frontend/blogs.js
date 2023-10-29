// Blog structure
class BlogItem{
    #title;
    #author;
    #createdDateAndTime;
    #content
    constructor(title,author,dateAndTime,content){
        this.#title=title;
        this.#author=author;
        this.#createdDateAndTime=dateAndTime;
        this.#content=content
    }

    get author(){
        return this.#author
    }

    get title(){
        return this.#title
    }

    get createdDateAndTime(){
        return this.#createdDateAndTime
    }

    get content(){
        return this.#content
    }
}

// Refering document elements through their attributes
const parent = document.getElementById("displayBlogs");
const createBtn = document.getElementById("create-button")
const createBlogForm = document.getElementById('create-blog-form');

// To add new Blog
createBtn.addEventListener('click', function () {
    createBlogForm.classList.toggle('hidden');
});

//Add new Blog to UI on clicking submit
const saveBlogBtn = document.getElementById('submit');
saveBlogBtn.addEventListener('click', function () {

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const author = document.getElementById('author').value;
    const created = new Date().toLocaleString();

    const newBlog = new BlogItem(title,author,created,content)

    if (!title.trim() || !author.trim() || !content.trim()) {
        alert('Please enter title, author and content.');
        return;
    }

    // Add the new blog to the UI display (not persisted) using existing blogs length
    addBlog(newBlog,parent,parent.querySelectorAll('.blog-card').length);
    // clear form data
    document.getElementById('title').value="";
    document.getElementById('content').value="";
    document.getElementById('author').value="";
    // Hide the form
    createBlogForm.classList.toggle('hidden');
    });

// Add blogs to website
const addBlog = function(itemCreated,parent,index){
    const item = document.createElement('div');
    const title = document.createElement('h1')
    const author = document.createElement('h2')
    const content = document.createElement('p')
    const date = document.createElement('h4')
    item.innerHTML+=`<button class="updateButton" data-index="${index}">Update</button>`
    item.appendChild(title);
    item.appendChild(author);
    item.appendChild(content)
    item.appendChild(date)
    item.className = "blog-card expanded"
    
    item.addEventListener('click', function () {
        item.classList.toggle('expanded');
    });
    const updateBtn = item.querySelector('.updateButton');
    updateBtn.addEventListener('click', function (event) {
        event.stopPropagation(); // Prevent the card from expanding when clicking the update button

        const blogIndex = this.getAttribute('data-index');
        updateBlog(blogIndex);
    });
    parent.appendChild(item)
    title.textContent=itemCreated.title;
    author.textContent=itemCreated.author;
    content.textContent=itemCreated.content;
    date.textContent=itemCreated.createdDateAndTime;
   
}

// Update a blog
function updateBlog(index) {
    const blogCard = parent.children[index];
    const blogContent = blogCard.querySelector('p');
    const blogAuthor = blogCard.querySelector('h2');
    const updateBtn = blogCard.querySelector('.updateButton');

    // Enable editing of content and author
    blogContent.contentEditable = true;
    blogAuthor.contentEditable = true;
    // Change button text to "Save"
    updateBtn.textContent = 'Save';

    // Add a class to prevent expanding and contracting
    blogCard.classList.add('updating');
    // Change button event listener to save changes
    updateBtn.removeEventListener('click', function (event) {
        event.stopPropagation(); // Prevent the card from expanding when clicking the update button

        const blogIndex = this.getAttribute('data-index');
        updateBlog(blogIndex);
    });
    updateBtn.addEventListener('click', saveChanges.bind(null, index));
}

// save the changes for blog
function saveChanges(index) {
    const blogCard = parent.children[index];
    const blogContent = blogCard.querySelector('p');
    const blogAuthor = blogCard.querySelector('h2');
    const updateBtn = blogCard.querySelector('.updateButton');

    // Disable editing of content and author
    blogContent.contentEditable = false;
    blogAuthor.contentEditable = false;

    // Change button text back to "Update"
    updateBtn.textContent = 'Update';

    // Remove the class to allow expanding and contracting
    blogCard.classList.remove('updating');

    // Change button event listener back to update
    updateBtn.removeEventListener('click', saveChanges);
    updateBtn.addEventListener('click', updateBlog.bind(null, index));
}

// To fetch existing Blogs
const fetchBlogs = ()=>{
    const personsUri= '../data/content.json'
    const xhr = new XMLHttpRequest();
    xhr.open('GET',personsUri);
    xhr.addEventListener('load',function (){
        if(this.status==200){
            const responseText = this.responseText;
            const blogList = JSON.parse(responseText);
            blogList.forEach((item, index)=>{
                const itemCreated = new BlogItem(item.title,item.author,item.created,item.content);
                addBlog(itemCreated,parent,index)
            });
        }
    });
    xhr.send();
}

// fetching all blogs by default when website running 
fetchBlogs();