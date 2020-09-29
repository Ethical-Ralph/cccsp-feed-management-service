const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");

const expect = chai.expect;
chai.use(chaiHttp);
chai.should();

const feedUrl = "/feed";

describe("FMS", () => {
  let feedId, oldTitle;

  describe("Feeds operation ", () => {
    it("Should create a new feed", (done) => {
      chai
        .request(server)
        .post(feedUrl)
        .send({
          title: "my title",
          paragraphs: ["paragraph"],
          imageUrls: ["imageurl"],
          videoUrls: ["videourl"],
        })
        .end((err, _res) => {
          feedId = _res.body.data._id;
          oldTitle = _res.body.data.title;

          expect(_res.status).to.equals(201);
          expect(_res.body.success).to.be.true;
          expect(_res.body.data).to.be.an("object");
          expect(_res.body.data).to.exist;
          done();
        });
    });

    it("Should reject if feed title is missing", (done) => {
      chai
        .request(server)
        .post(feedUrl)
        .send({
          paragraphs: ["paragraph"],
          imageUrls: ["imageurl"],
          videoUrls: ["videourl"],
        })
        .end((err, res) => {
          expect(res.status).to.be.equals(400);
          expect(res.body.success).to.be.false;
          expect(res.body.error.message).to.be.equal(
            'ValidationError: "title" is required'
          );
          done();
        });
    });
    it("Should edit an existing feed", (done) => {
      const newData = {
        title: "new title",
        paragraphs: ["new paragraph"],
        imageUrls: ["new imageurl"],
        videoUrls: ["new videourl"],
      };
      chai
        .request(server)
        .put(`${feedUrl}/${feedId}`)
        .send(newData)
        .end((err, res) => {
          expect(res.body.data).to.be.an("object");
          expect(res.body.data.title).to.be.equal(newData.title);
          expect(res.body.data.title).to.not.be.equal(oldTitle);
          expect(res.status).to.equals(200);
          done();
        });
    });

    it("Should get a feed with id", (done) => {
      chai
        .request(server)
        .put(`${feedUrl}/${feedId}`)
        .end((err, res) => {
          expect(res.body.success).to.be.true;
          expect(res.body.data).to.be.an("object");
          expect(res.status).to.equals(200);
          done();
        });
    });

    it("Should like a feed", (done) => {
      const dummyUserId = "hsdflgdf98dfffv778t";
      chai
        .request(server)
        .patch(`${feedUrl}/${feedId}/likeorunlike`)
        .end((err, res) => {
          expect(res.body.success).to.be.true;
          expect(res.body.data.likes).includes(dummyUserId);
          expect(res.body.data).to.be.an("object");
          expect(res.status).to.equals(200);
          done();
        });
    });

    it("Should unlike a feed", (done) => {
      const dummyUserId = "hsdflgdf98dfffv778t";
      chai
        .request(server)
        .patch(`${feedUrl}/${feedId}/likeorunlike`)
        .end((err, res) => {
          expect(res.body.success).to.be.true;
          expect(res.body.data.likes).to.not.include(dummyUserId);
          expect(res.body.data).to.be.an("object");
          expect(res.status).to.equals(200);
          done();
        });
    });

    it("Should increase share count", (done) => {
      chai
        .request(server)
        .patch(`${feedUrl}/${feedId}/sharecount`)
        .end((err, res) => {
          expect(res.body.success).to.be.true;
          expect(res.body.data.messsage).to.be.equal(
            "sharecount updated successfully"
          );
          expect(res.status).to.equals(200);
          done();
        });
    });

    it("should delete a feed", (done) => {
      chai
        .request(server)
        .delete(`${feedUrl}/${feedId}`)
        .end((err, res) => {
          expect(res.body.success).to.be.true;
          expect(res.body.data.messsage).to.be.equal(
            "Feed deleted successfully"
          );
          expect(res.status).to.equals(200);
          done();
        });
    });
  });
});
