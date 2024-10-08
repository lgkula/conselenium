import pkg from 'pactum';
const { spec } = pkg;
import { expect } from 'chai';
import { baseUrl, userId, userName, password } from '../helpers/data.js';

let token;

describe('API tests', () => {
  it.skip('first test', async () => {
    const response = await spec().get(`${baseUrl}/BookStore/v1/Books`);
    //   .inspect();
    expect(response.statusCode).to.eql(200);
    expect(response.body.books[0].title).to.eql('Git Pocket Guide');
    expect(response.body.books[4].author).to.eql('Kyle Simpson');
    const book = response.body.books.find(
      (book) => book.author === 'Kyle Simpson'
    );
    expect(book.title).to.eql("You Don't Know JS");
  });

  it.skip('create account', async () => {
    const response = await spec()
      .post(`${baseUrl}/Account/v1/User`)
      //   .inspect()
      .withBody({
        userName: userName,
        password: password,
      });
    expect(response.statusCode).to.eql(201);
  });

  it('generate token', async () => {
    const response = await spec()
      .post(`${baseUrl}/Account/v1/GenerateToken`)
      //   .inspect()
      .withBody({
        userName: userName,
        password: password,
      });
    expect(response.statusCode).to.eql(200);
    token = response.body.token;
    //   console.log('token: ', token)
  });

  it('Autohorize', async () => {
    const response = await spec()
      .post(`${baseUrl}/Account/v1/Authorized`)
      //   .inspect()
      .withBody({
        userName: userName,
        password: password,
      });
    expect(response.statusCode).to.eql(200);
  });

  it('Get User Id', async () => {
    const response = await spec()
      .get(`${baseUrl}/Account/v1/User/${userId}`)
      .withBearerToken(token)
    //   .inspect();
    expect(response.statusCode).to.eql(200);
  });
  
  it('Remove all books', async () => {
    const response = await spec()
      .delete(`${baseUrl}/BookStore/v1/Books?UserId=${userId}`)
      .withBearerToken(token)
      .retry({
        count: 2,
        delay: 2000,
        strategy: ({ res }) => {
          return res.statusCode === 204;
        },
      });
      
    //   .inspect();
    expect(response.statusCode).to.eql(204);
  });
  
  it('Add and remove book isbn 9781593277574', async () => {
    const isbnNumber = '9781593277574';
    const response1 = await spec()
      .post(`${baseUrl}/BookStore/v1/Books`)
      //   .inspect()
      .withBody({
        userId: `${userId}`,
        collectionOfIsbns: [
          {
            isbn: isbnNumber,
          },
        ],
      })
      .withBearerToken(token);
    expect(response1.statusCode).to.eql(201);
    //   });

    //   it('Get added book', async () => {
    const response2 = await spec()
      .get(`${baseUrl}/Account/v1/User/${userId}`)
      .withBearerToken(token);
    //   .inspect();
    expect(response2.statusCode).to.eql(200);
    expect(response2.body.books[0].isbn).to.eql(isbnNumber);

    //   });

    //   it('Remove book', async () => {
    const response3 = await spec()
      .delete(`${baseUrl}/BookStore/v1/Book`)
      //   .inspect()
      .withBody({
        isbn: isbnNumber,
        userId: `${userId}`,
      })
      .withBearerToken(token);
    expect(response3.statusCode).to.eql(204);
    //   });

    //   it('Get empty book list', async () => {
    const response4 = await spec()
      .get(`${baseUrl}/Account/v1/User/${userId}`)
      .withBearerToken(token);
    //   .inspect();
    expect(response4.statusCode).to.eql(200);
    expect(response4.body.books).to.be.an('array').that.is.empty;
  });
  
  it('Add and remove book isbn 9781449325862', async () => {
    const isbnNumber = '9781449325862';
    const response1 = await spec()
      .post(`${baseUrl}/BookStore/v1/Books`)
      //   .inspect()
      .withBody({
        userId: `${userId}`,
        collectionOfIsbns: [
          {
            isbn: isbnNumber,
          },
        ],
      })
      .withBearerToken(token);
    expect(response1.statusCode).to.eql(201);
    
    const response2 = await spec()
      .get(`${baseUrl}/Account/v1/User/${userId}`)
      .withBearerToken(token);
    //   .inspect();
    expect(response2.statusCode).to.eql(200);
    expect(response2.body.books[0].isbn).to.eql(isbnNumber);

    const response3 = await spec()
      .delete(`${baseUrl}/BookStore/v1/Book`)
      //   .inspect()
      .withBody({
        isbn: isbnNumber,
        userId: `${userId}`,
      })
      .withBearerToken(token);
    expect(response3.statusCode).to.eql(204);
    
    const response4 = await spec()
      .get(`${baseUrl}/Account/v1/User/${userId}`)
      .withBearerToken(token);
    //   .inspect();
    expect(response4.statusCode).to.eql(200);
    expect(response4.body.books).to.be.an('array').that.is.empty;
  });

});
