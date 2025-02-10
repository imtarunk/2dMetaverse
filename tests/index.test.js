const { default: axios } = require("axios");

const BACKEND_URL = "http://localhost:3000";
const WS_URL = "ws:localhost:3001";

describe("Authentication", async () => {
  let token = "";

  test("user able to signup only once", async () => {
    const username = `tarunksaini-${Math.random() * 10}`;
    const password = "123123";
    const respons = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });
    expect(respons.statusCode).toBe(200); //user signup success

    const updateRespons = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });
    expect(updateRespons.statusCode).toBe(400); // is user is not able signup
  });

  test("user login", async () => {
    const username = `tarunksaini-${Math.random() * 10}`;
    const password = "123123";
    const respons = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
    });

    expect(respons.body.token).toBeDefined(200);

    const UpdateRespons = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username: "wrongUsername",
      password,
    });
    expect(UpdateRespons.statusCode).toBe(403); //unauthorized user login
  });
});

describe("User metadata endpoint", async () => {
  let token = "";
  let avaterId = "";

  beforAll(async () => {
    const username = "tarun" + Math.random();
    const password = "123123";

    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    const respons = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });

    token = respons.data.token;
  });

  test("user cant update thier avater using wrong credentil", async () => {
    const avaterResponse = awaitaxios.post(
      `${BACKEND_URL}/api/v1/admin/avater`,
      {
        avatars: [
          {
            id: 1,
            imageUrl: "https://image.com/avatar1.png",
            name: "ishhu",
          },
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        ],
      }
    );
  });

  expect(statusCode).toBe(400); //failed
  test("user can not update thier avater if header is not present", async () => {
    const avaterResponse = awaitaxios.post(
      `${BACKEND_URL}/api/v1/admin/avater`,
      {
        avatars: [
          {
            id: 1,
            imageUrl: "https://image.com/avatar1.png",
            name: "ishhu",
          },
        ],
      }
    );
  });
  expect(respons.statusCode).toBe(403); //success update

  test("User can update thier metadata", async () => {
    const respons = await axios.post(
      `${BACKEND_URL}/api/v1/user/metadata`,
      {
        avaterId,
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
  });
  expect(respons.statusCode).toBe(200); //success update
});

describe("user avater information", async () => {
  let avatarId;
  let token;
  let userId;
  let element1Id;
  let element2Id;

  beforAll(async () => {
    const username = "tarun" + Math.random();
    const password = "123123";

    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    const respons = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });

    token = respons.data.token;
  });

  test("get back avatar information for a user", async () => {
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`
    );

    expect(response.data.avatars.length).toBe(1);
    expect(response.data.avatars[0].userId).toBe(userId);
  });

  test("Available avatar lists the recently created avatar ", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/avatars`);
    expect(response.data.avatars.length).not.toBe(0);
    const currentAvatar = response.data.avatars.find((x) => x.id == avatarId);
    expect(currentAvatar).toBeDefined();
  });
});

describe("space information", async () => {
  let adminToken;
  let adminId;
  let userId;
  let userToken;
  let element1Id;
  let element2Id;
  let mapId;

  beforeAll("", async () => {
    const username = "tarun" + Math.random();
    const password = "123123";

    const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    adminId = signupResponse.data.adminId;

    const loginResponse = await axios.post(`${BACKEND_URL}/api/v1/login`, {
      username,
      password,
      type: "admin",
    });

    adminToken = loginResponse.data.adminToken;

    const userSignupResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      {
        username,
        password,
      }
    );

    userId = userSignupResponse.data.userId;

    const UserResponse = await axios.post(`${BACKEND_URL}/api/v1/login`, {
      username,
      password,
    });

    userToken = UserResponse.data.userToken;

    const element1 = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true, // weather or not the user can sit on top of this element (is it considered as a collission or not)
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const element2 = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true, // weather or not the user can sit on top of this element (is it considered as a collission or not)
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    let element1Id = element1.id;
    let element2Id = element2.id;

    const map = await axios.post(
      `${BACKEND_URL}/api/v1/admin/map`,
      {
        thumbnail: "https://thumbnail.com/a.png",
        dimensions: "100x200",
        name: "100 person interview room",
        defaultElements: [
          {
            elementId: element1Id,
            x: 20,
            y: 20,
          },
          {
            elementId: element1Id,
            x: 18,
            y: 20,
          },
          {
            elementId: element2Id,
            x: 19,
            y: 20,
          },
          {
            elementId: element2Id,
            x: 19,
            y: 20,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const respons = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });

    token = respons.data.token;
  });

  test("User is able to create a space", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
        mapId: mapId,
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(response.status).toBe(200);
    expect(response.data.spaceId).toBeDefined();
  });

  test("user is able to create space without mapId (without map id) ", async () => {
    const res = axios.post(`${BACKEND_URL}/api/v1/space`, {
      name: "Test",
      dimensions: "100x200",
    });
    expect(res.spaceId).toBeDefined();
  });

  test("user is not able to create space without mapId and dimension  ", async () => {
    const res = axios.post(`${BACKEND_URL}/api/v1/space`, {
      name: "Test",
    });
    expect(res.statusCode).toBe(400);
  });

  test("user is not able to delete a space that does not exist ", async () => {
    const res = await axios.delete(
      `${BACKEND_URL}/api/v1/space/randomIdDoesntExist`,
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(res.statusCode).toBe(400);
  });

  test("user is not able to delete space that does not exist", async () => {
    const res = await axios.delete(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    const deleteReponse = await axios.delete(
      `${BACKEND_URL}/api/v1/space/${response.data.spaceId}`,
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    expect(deleteReponse.status).toBe(200);
  });

  test("User should not be able to delete a space created by another user", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    const deleteReponse = await axios.delete(
      `${BACKEND_URL}/api/v1/space/${response.data.spaceId}`,
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    expect(deleteReponse.status).toBe(403);
  });

  test("Admin has no spaces initially", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
      headers: {
        authorization: `Bearer ${adminToken}`,
      },
    });
    expect(response.data.spaces.length).toBe(0);
  });
  test("Admin has gets once space after", async () => {
    const spaceCreateReponse = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    console.log("jhflksdjflksdfjlksdfj");
    console.log(spaceCreateReponse.data);
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
      headers: {
        authorization: `Bearer ${adminToken}`,
      },
    });
    const filteredSpace = response.data.spaces.find(
      (x) => x.id == spaceCreateReponse.data.spaceId
    );
    expect(response.data.spaces.length).toBe(1);
    expect(filteredSpace).toBeDefined();
  });
});

describe("Arena endpoints", () => {
  let mapId;
  let element1Id;
  let element2Id;
  let adminToken;
  let adminId;
  let userToken;
  let userId;
  let spaceId;

  beforeAll(async () => {
    const username = `kirat-${Math.random()}`;
    const password = "123456";

    const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    adminId = signupResponse.data.userId;

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username: username,
      password,
    });

    adminToken = response.data.token;

    const userSignupResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      {
        username: username + "-user",
        password,
        type: "user",
      }
    );

    userId = userSignupResponse.data.userId;

    const userSigninResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signin`,
      {
        username: username + "-user",
        password,
      }
    );

    userToken = userSigninResponse.data.token;

    const element1Response = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    const element2Response = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    element1Id = element1Response.data.id;
    element2Id = element2Response.data.id;

    const mapResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/map`,
      {
        thumbnail: "https://thumbnail.com/a.png",
        dimensions: "100x200",
        name: "Default space",
        defaultElements: [
          {
            elementId: element1Id,
            x: 20,
            y: 20,
          },
          {
            elementId: element1Id,
            x: 18,
            y: 20,
          },
          {
            elementId: element2Id,
            x: 19,
            y: 20,
          },
        ],
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    mapId = mapResponse.data.id;

    const spaceResponse = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
        mapId: mapId,
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    console.log(spaceResponse.data);
    spaceId = spaceResponse.data.spaceId;
  });

  test("Incorrect spaceId returns a 400", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/123kasdk01`, {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
    });
    expect(response.status).toBe(400);
  });

  test("Correct spaceId returns all the elements", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
    });
    console.log(response.data);
    expect(response.data.dimensions).toBe("100x200");
    expect(response.data.elements.length).toBe(3);
  });

  test("Delete endpoint is able to delete an element", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
    });

    console.log(response.data.elements[0].id);
    let res = await axios.delete(`${BACKEND_URL}/api/v1/space/element`, {
      data: { id: response.data.elements[0].id },
      headers: {
        authorization: `Bearer ${userToken}`,
      },
    });

    const newResponse = await axios.get(
      `${BACKEND_URL}/api/v1/space/${spaceId}`,
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    expect(newResponse.data.elements.length).toBe(2);
  });

  test("Adding an element fails if the element lies outside the dimensions", async () => {
    const newResponse = await axios.post(
      `${BACKEND_URL}/api/v1/space/element`,
      {
        elementId: element1Id,
        spaceId: spaceId,
        x: 10000,
        y: 210000,
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    expect(newResponse.status).toBe(400);
  });

  test("Adding an element works as expected", async () => {
    await axios.post(
      `${BACKEND_URL}/api/v1/space/element`,
      {
        elementId: element1Id,
        spaceId: spaceId,
        x: 50,
        y: 20,
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    const newResponse = await axios.get(
      `${BACKEND_URL}/api/v1/space/${spaceId}`,
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    expect(newResponse.data.elements.length).toBe(3);
  });
});

describe("Admin Endpoints", () => {
  let adminToken;
  let adminId;
  let userToken;
  let userId;

  beforeAll(async () => {
    const username = `kirat-${Math.random()}`;
    const password = "123456";

    const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    adminId = signupResponse.data.userId;

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username: username,
      password,
    });

    adminToken = response.data.token;

    const userSignupResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      {
        username: username + "-user",
        password,
        type: "user",
      }
    );

    userId = userSignupResponse.data.userId;

    const userSigninResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signin`,
      {
        username: username + "-user",
        password,
      }
    );

    userToken = userSigninResponse.data.token;
  });

  test("User is not able to hit admin Endpoints", async () => {
    const elementReponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    const mapResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/map`,
      {
        thumbnail: "https://thumbnail.com/a.png",
        dimensions: "100x200",
        name: "test space",
        defaultElements: [],
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    const avatarResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/avatar`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
        name: "Timmy",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    const updateElementResponse = await axios.put(
      `${BACKEND_URL}/api/v1/admin/element/123`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    expect(elementReponse.status).toBe(403);
    expect(mapResponse.status).toBe(403);
    expect(avatarResponse.status).toBe(403);
    expect(updateElementResponse.status).toBe(403);
  });

  test("Admin is able to hit admin Endpoints", async () => {
    const elementReponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    const mapResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/map`,
      {
        thumbnail: "https://thumbnail.com/a.png",
        name: "Space",
        dimensions: "100x200",
        defaultElements: [],
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    const avatarResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/avatar`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
        name: "Timmy",
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    expect(elementReponse.status).toBe(200);
    expect(mapResponse.status).toBe(200);
    expect(avatarResponse.status).toBe(200);
  });

  test("Admin is able to update the imageUrl for an element", async () => {
    const elementResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    const updateElementResponse = await axios.put(
      `${BACKEND_URL}/api/v1/admin/element/${elementResponse.data.id}`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    expect(updateElementResponse.status).toBe(200);
  });
});

describe("websocket tests", async () => {
  let adminToken;
  let adminId;
  let userToken;
  let useId;
  let mapId;
  let element1Id;
  let element2Id;
  let spaceId;
  let ws1;
  let ws2;
  let ws1Messages = [];
  let ws2Messages = [];
  let userX = x;
  let userY = y;
  let adminX = x;
  let adminY = x;

  function waitForAndPopLatestMessage(messageArray) {
    return new Promise((resolve) => {
      if (messageArray.length > 0) {
        resolve(messageArray.shift());
      } else {
        let interval = setInterval(() => {
          if (messageArray.length > 0) {
            resolve(messageArray.shift());
            clearInterval(interval);
          }
        }, 100);
      }
    });
  }

  async function setupHTTP() {
    const username = "tarunksaini";
    const password = "123123";

    const adminSignupRes = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    const adminLoginRes = await axios.post(`${BACKEND_URL}/api/v1/login`, {
      username,
      password,
      type: "admin",
    });

    adminId = adminSignupRes.data.adminId;
    adminToken = adminLoginRes.data.adminToken;
    console.log("adminSignupResponse.status");
    console.log(adminSignupRes.status);

    const userSignupRes = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
    });
    const userLoginRes = await axios.post(`${BACKEND_URL}/api/v1/login`, {
      username,
      password,
    });

    useId = userSignupRes.data.userId;
    userToken = userLoginRes.data.userToken;
    console.log(
      "user signup/login status : " + userLoginRes.status + userSignupRes.status
    );
  }

  async function setupWS() {
    ws1 = new WebSocket(WS_URL);
    ws2 = new WebSocket(WS_URL);

    await new Promise((r) => {
      //waitting for connection webSockeet server1
      ws1.onopen = r;
    });

    await new Promise((r) => {
      //waitting for connection webSockeet server2
      ws2.onopen = r;
    });

    ws1.onmessage = (e) => {
      ws1Messages.push(JSON.parse(e.data)); //sending message of ws1 to ws1 arr
    };

    ws2.onmessage = (e) => {
      ws2Messages.push(JSON.parse(e.data)); //sending message of ws2 to ws2 arr
    };
  }

  beforeAll(async () => {
    setupHTTP();
    setupWS();
  });

  test("get back ack for joining the space", async () => {
    ws1.send(
      JSON.stringify({
        type: "join",
        payload: {
          spaceId: spaceId,
          token: userToken,
        },
      })
    );
    const message1 = await waitForAndPopLatestMessage(ws1Messages);

    ws1.send(
      JSON.stringify({
        type: "join",
        payload: {
          spaceId: spaceId,
          token: adminToken,
        },
      })
    );

    const message2 = await waitForAndPopLatestMessage(ws1Messages);
    const message3 = await waitForAndPopLatestMessage(ws2Messages);

    expect(message1.type).toBe("space-joined");
    expect(message2.type).toBe("space-joined");

    expect(message1.payload.users.lengt).toBe(0);
    expect(message2.payload.users.length).toBe(1);
    adminX = message1.payload.spawn.x;
    adminY = message1.payload.spaen.y;

    userX = message2.payload.spawn.x;
    userY = message2.payload.spawn.y;
  });

  test("user should not be able to move across the boundary of the wall", async () => {
    ws1.send(
      JSON.stringify({
        type: "movement",
        payload: {
          x: 1000000,
          y: 100000,
        },
      })
    );
    const message = await waitForAndPopLatestMessage(ws1Messages);
    expect(message.type).toBe("movement-rejected");
    expect(message.payload.x).toBe(adminX);
    expect(message.payload.y).toBe(adminY);
  });

  test("user should not be able to move two block at the same time", async () => {
    ws1.send(
      JSON.stringify({
        type: "movement",
        payload: {
          x: adminX + 2,
          y: adminY,
          useId: adminId,
        },
      })
    );
    const message = await waitForAndPopLatestMessage(ws1Messages);
    expect(message.type).toBe("movement-rejected");
    expect(message.payload.x).toBe(adminX);
    expect(message.payload.y).toBe(adminY);
  });

  test("Correct movement should be broadcasted to the other sockets in the room", async () => {
    ws1.send(
      JSON.stringify({
        type: "movement",
        payload: {
          x: adminX + 1,
          y: adminY,
        },
      })
    );
    const message = await waitForAndPopLatestMessage(ws1Messages);
    expect(message.type).toBe("movement-rejected");
    expect(message.payload.x).toBe(adminX);
    expect(message.payload.y).toBe(adminY);
  });

  test("If a user leaves,the other user receives a leave event", async () => {
    ws1.close();
    const message = await waitForAndPopLatestMessage(ws2Messages);
    expect(message.type).toBe("user-left");
    expect(message.payload.userId).toBe(adminUserId);
  });
});
