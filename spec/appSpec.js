const app = require("../app");
const request = require("promise");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const qs = require("qs");

describe("App", () => {
  const baseUrl = "http://localhost:8888";
  const apiUrl = baseUrl + "/api/v1/";
  let server;
  let user;
  const apiUrlFor = (type, params) => {
    params = params ? `&${qs.stringify(params)}` : "";
    return `${apiUrl}${type}?access_token=${user.token}${params}`;
  };
  const j = str => JSON.parse(str);

  beforeAll(done => {
    server = app.listen(8888, () => {
      done();
    });
  });

  beforeEach(done => {
    User.create({
      fname: "Foo",
      lname: "Bar",
      email: "foobar@gmail",
      password: "password"
    })
      .then(result => {
        user = result;
        done();
      })
      .catch(e => console.error(e));
  });

  afterEach(done => {
    User.remove({}).then(() => done()).catch(e => console.error(e));
  });

  afterAll(done => {
    server.close();
    server = null;
    done();
  });

  // ----------------------------------------
  // App
  // ----------------------------------------

  it("renders the home page", done => {
    request.get(baseUrl, (err, res, body) => {
      expect(res.statusCode).toBe(200);

      expect(body).toMatch(/api/i);
      done();
    });
  });

  it("does not allow requests without an access_token", done => {
    request.get(apiUrl, (err, res, body) => {
      // Note, this SHOULD have a status code of 401
      // however something is not working right with
      // the Passport HTTP Bearer package in setting
      // the correct status code
      // See Github issue:
      // https://github.com/jaredhanson/passport-http-bearer/issues/11
      expect(res.statusCode).toBe(404);
      done();
    });
  });

  // ----------------------------------------
  // List API
  // ----------------------------------------
  describe("List APIs", () => {
    it("returns an array with the default number of nouns", done => {
      request.get(apiUrlFor("nouns"), (err, res, body) => {
        let result = j(body);

        expect(result.length).toEqual(10);
        done();
      });
    });

    it("returns an array with the specified number of nouns", done => {
      request.get(apiUrlFor("nouns", { count: 22 }), (err, res, body) => {
        let result = j(body);

        expect(result.length).toEqual(22);
        done();
      });
    });

    it("returns an array with the default number of verbs", done => {
      request.get(apiUrlFor("verbs"), (err, res, body) => {
        let result = j(body);

        expect(result.length).toEqual(10);
        done();
      });
    });

    it("returns an array with the specified number of verbs", done => {
      request.get(apiUrlFor("verbs", { count: 22 }), (err, res, body) => {
        let result = j(body);

        expect(result.length).toEqual(22);
        done();
      });
    });

    it("returns an array with the default number of adverbs", done => {
      request.get(apiUrlFor("adverbs"), (err, res, body) => {
        let result = j(body);

        expect(result.length).toEqual(10);
        done();
      });
    });

    it("returns an array with the specified number of adverbs", done => {
      request.get(apiUrlFor("adverbs", { count: 22 }), (err, res, body) => {
        let result = j(body);

        expect(result.length).toEqual(22);
        done();
      });
    });

    it("returns an array with the default number of adjectives", done => {
      request.get(apiUrlFor("adjectives"), (err, res, body) => {
        let result = j(body);

        expect(result.length).toEqual(10);
        done();
      });
    });

    it("returns an array with the specified number of adjectives", done => {
      request.get(apiUrlFor("adjectives", { count: 22 }), (err, res, body) => {
        let result = j(body);

        expect(result.length).toEqual(22);
        done();
      });
    });
  });
});