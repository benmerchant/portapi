// blogpost.test.js
process.env.NODE_ENV = 'test';
const BlogPost = require('../app/models/blogpost.model');
const server = require('../server');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const blogURL = '/api/blogposts';

describe('Blog Posts', () => {
  beforeEach(done => {
    BlogPost.remove({}, err => {
      if(err) console.error(err);
      done();
    });
  });
  describe('/POST/ - publish a BlogPost', () => {
    it('it should POST a new BlogPost', done => {
      const NewBlogPost = {
        // url: 'my-first-blog-post', // you can remove this line
        title: 'My First Blog Post',
        body: 'This is some text. Lorem ipsum... etc...',
        tags: ['blog', 'nodejs', 'api']
      };
      const theURL = NewBlogPost.title.toLowerCase().split(' ').join('-');
      chai.request(server)
          .post(blogURL)
          .send(NewBlogPost)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('msg')
              .eql('Successfully published blog post.');
            expect(res.body).to.have.property('blogPost');
            expect(res.body.blogPost).to.have.property('url')
              .and.be.an('string').eql(theURL);
            expect(res.body.blogPost).to.have.property('title')
              .and.be.an('string').eql(NewBlogPost.title);
            expect(res.body.blogPost).to.have.property('body')
              .and.be.an('string').eql(NewBlogPost.body);
            expect(res.body.blogPost).to.have.property('tags')
              .and.be.an('array').and.have.length(NewBlogPost.tags.length)
              .eql(NewBlogPost.tags);
            expect(res.body.blogPost).to.have.property('date');
            expect(res.body.blogPost).to.have.property('_id');
            done();
          });
    });
    it('it should not POST a new BlogPost without a body', done => {
      const NewBlogPost = {
        // url: 'my-first-blog-post', // you can remove this line
        title: 'My First Blog Post',
        tags: ['blog', 'nodejs', 'api']
      };
      chai.request(server)
          .post(blogURL)
          .send(NewBlogPost)
          .end((err, res) => {
            expect(res).to.have.status(422);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('msg')
              .eql('Server encountered an error publishing blog post.');
            expect(res.body).to.have.property('error').and.be.an('object');
            expect(res.body.error).to.have.property('errors')
              .and.be.an('object');
            expect(res.body.error.errors).to.have.property('body')
              .and.be.an('object');
            expect(res.body.error.errors.body).to.have.property('kind')
              .eql('required');
          done();
          });
    });
  });
});
