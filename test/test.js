const assert = require("assert");
const { igApi } = require("../dist/index.js");

describe("igApi", function () {
  let igCookies, igNoCookies;
  this.beforeEach(function () {
    const sessionId = "session id here";
    igNoCookies = new igApi(sessionId, false);
    igCookies = new igApi(sessionId, true);
  });

  describe("getIdByUsername()", function () {
    it("should return the same results", async function () {
      this.timeout(3000);
      const username = "willsmith";
      const [igNoCookiesId, igCookiesId] = await Promise.all([
        igNoCookies.getIdByUsername(username),
        igCookies.getIdByUsername(username),
      ]);
      assert.equal(igNoCookiesId, igCookiesId);
    });
  });

  describe("fetchPost()", function () {
    it("should return the same result", async function () {
      const link =
        "https://www.instagram.com/reel/Ca9PU3sIjF4/?utm_medium=share_sheet";
      const [igNoCookiesPost, igCookiesPost] = await Promise.all([
        igNoCookies.fetchPost(link),
        igCookies.fetchPost(link),
      ]);
      // links are different
      delete igNoCookiesPost.links;
      delete igCookiesPost.links;
      assert.deepEqual(igNoCookiesPost, igCookiesPost);
    });
  });

  describe("fetchUser()", function () {
    it("should return the same results", async function () {
      this.timeout(4000);
      const username = "willsmith";
      const [igNoCookiesUser, igCookiesUser] = await Promise.all([
        igNoCookies.fetchUser(username),
        igCookies.fetchUser(username),
      ]);
      assert.equal(igNoCookiesUser.id, igCookiesUser.id);
    });
  });

  describe("fetchUserV2()", function () {
    it("should return the same results", async function () {
      this.timeout(4000);
      const username = "willsmith";
      const [igNoCookiesUser, igCookiesUser] = await Promise.all([
        igNoCookies.fetchUserV2(username),
        igCookies.fetchUserV2(username),
      ]);
      assert.equal(igNoCookiesUser.id, igCookiesUser.id);
    });
  });

  describe("fetchStories()", function () {
    it("should return the same results", async function () {
      this.timeout(5000);
      const username = "willsmith";
      const [igNoCookiesStories, igCookiesStories] = await Promise.all([
        igNoCookies.fetchStories(username),
        igCookies.fetchStories(username),
      ]);
      assert.equal(igNoCookiesStories.username, igCookiesStories.username);
    });
  });

  describe("fetchHighlights()", function () {
    it("should return the same results", async function () {
      this.timeout(5000);
      const username = "willsmith";
      const [igNoCookiesHighlights, igCookiesHighlights] = await Promise.all([
        igNoCookies.fetchHighlights(username),
        igCookies.fetchHighlights(username),
      ]);
      assert.deepEqual(igNoCookiesHighlights, igCookiesHighlights);
    });
  });
});
