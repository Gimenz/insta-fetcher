const assert = require("assert");
const { igApi } = require("../dist/index.js");

describe("igApi", function () {
  let ig;
  this.beforeEach(function () {
    ig = new igApi("session id here", false);
  });

  describe("getIdByUsername()", function () {
    it("should return an id", function () {
      try {
        ig.getIdByUsername("willsmith").then((id) => {
          assert.ok(id);
        });
      } catch (error) {
        assert.fail([error]);
      }
    });
  });

  describe("fetchPost()", function () {
    it("should return a post", function () {
      try {
        ig.fetchPost(
          "https://www.instagram.com/reel/Ca9PU3sIjF4/?utm_medium=share_sheet"
        ).then((post) => {
          assert.ok(post);
        });
      } catch (error) {
        assert.fail([error]);
      }
    });
  });

  describe("fetchUser()", function () {
    it("should return a user", function () {
      try {
        ig.fetchUser("willsmith").then((user) => {
          assert.ok(user);
        });
      } catch (error) {
        assert.fail([error]);
      }
    });
  });

  describe("fetchUserV2()", function () {
    it("should return a user", function () {
      try {
        ig.fetchUserV2("willsmith").then((user) => {
          assert.ok(user);
        });
      } catch (error) {
        assert.fail([error]);
      }
    });
  });

  describe("fetchStories()", function () {
    it("should return stories", function () {
      try {
        ig.fetchStories().then((stories) => {
          assert.ok(stories);
        });
      } catch (error) {
        assert.fail([error]);
      }
    });
  });

  describe("fetchHighlights()", function () {
    it("should return highlights", function () {
      try {
        ig.fetchHighlights().then((highlights) => {
          assert.ok(highlights);
        });
      } catch (error) {
        assert.fail([error]);
      }
    });
  });
});
