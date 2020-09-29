const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");

const expect = chai.expect;
chai.use(chaiHttp);
chai.should();

const feedUrl = "/feed";

describe("CMS", () => {
  describe("Comment service", () => {
    let commentId, newFeedId;
    it("should comment on a feed", (done) => {
      const data = {
        text: "Hey, this is my comment",
      };

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
          newFeedId = _res.body.data._id;
          chai
            .request(server)
            .post(`${feedUrl}/${newFeedId}/comment`)
            .send(data)
            .end((err, res) => {
              commentId = res.body.data._id;
              expect(res.body.success).to.be.true;
              expect(res.body.data.text).to.be.equal(data.text);
              expect(res.status).to.equals(201);
              done();
            });
        });
    });

    it("should get all comment for a feed", (done) => {
      chai
        .request(server)
        .get(`${feedUrl}/${newFeedId}/comment`)
        .end((err, res) => {
          expect(res.body.success).to.be.true;
          expect(res.body.data).to.be.an("array");
          expect(res.body.data[0].feedId).to.be.equal(newFeedId);
          expect(res.status).to.equals(200);
          done();
        });
    });
    it("should edit a comment", (done) => {
      chai
        .request(server)
        .patch(`${feedUrl}/${newFeedId}/comment/${commentId}`)
        .send({ text: "new comment text" })
        .end((err, res) => {
          expect(res.body.success).to.be.true;
          expect(res.body.data).to.be.an("object");
          expect(res.status).to.equals(200);
          done();
        });
    });

    it("should get delete a comment", (done) => {
      chai
        .request(server)
        .delete(`${feedUrl}/${newFeedId}/comment/${commentId}`)
        .end((err, res) => {
          expect(res.body.success).to.be.true;
          expect(res.body.data.message).to.be.equal(
            "Comment deleted successfully"
          );
          expect(res.status).to.equals(200);
          done();
        });
    });
  });
});
