const express = require("express");
const router = express.Router();

const db = require("../db");
const auth = require("../middleware/auth");

/** ACCOUNTS */
router.post("/signup", async (req, res) => {
  try {
    // Deconstruct the parameters from the request body
    const { email, username, password } = req.body;

    // Check if the request body has either an email or a username-password pair
    if (!email && (!username || !password)) {
      throw { sqlMessage: "Insufficient parameters.", errno: 1054 };
    }

    // Build query payload depending if the parameter is an email or a username-password pair
    const payload = {};
    if (email) {
      payload.email = email;
    } else {
      payload.username = username;
      payload.password = password;
    }

    // Post the account in the database
    const [account] = await db("accounts").insert(payload);
    res.status(200).json({ success: true, user_id: account });
  } catch (e) {
    res.status(500).json({
      success: false,
      error: { code: e.errno, message: e.sqlMessage },
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    // Deconstruct the parameters from the request body
    const { email, username, password } = req.body;

    // Check if the request body has either an email or a username-password pair
    if (!email && (!username || !password)) {
      throw { sqlMessage: "Insufficient parameters.", errno: 1054 };
    }

    // Build query condition depending if the parameter is an email or a username-password pair
    const condition = {};
    if (email) {
      condition.email = email;
    } else {
      condition.username = username;
      condition.password = password;
    }

    // Query the account in the database
    const account = await db("accounts").first(["id"]).where(condition);

    // Check if session exists, create new session otherwise
    let session;
    const checkSession = await db("sessions")
      .first(["id", "user_id"])
      .where({ user_id: account.id });
    if (!checkSession) {
      const [new_session] = await db("sessions").insert({
        user_id: account.id,
      });
      session = {
        id: new_session,
      };
    } else {
      session = checkSession;
    }

    // Check if the account exists
    if (!account) {
      throw { sqlMessage: "Account does not exist.", errno: 1176 };
    } else {
      res.status(200).json({
        success: true,
        user_id: account.id,
        session_id: session.id,
        token: `Bearer ${process.env.ACCESS_TOKEN}`,
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      error: { code: e.errno, message: e.sqlMessage },
    });
  }
});

router.post("/logout", auth.validate, async (req, res) => {
  try {
    // Deconstruct the parameters from the request body
    const { user_id, session_id } = req.body;

    // Check if the request parameter exists
    if (!user_id && !session_id) {
      throw { sqlMessage: "Insufficient parameters.", errno: 1054 };
    }

    // Build query condition depending if the parameter is a user id or a session id
    const condition = {};
    if (user_id) {
      condition.user_id = user_id;
    } else {
      condition.session_id = session_id;
    }

    // Check if the session exists
    const session = await db("sessions")
      .first(["id", "user_id"])
      .where(condition);

    // Delete the session in the database
    if (!session) {
      throw { sqlMessage: "Session does not exist.", errno: 1176 };
    } else {
      await db("sessions").where(condition).del();
      res.status(200).json({ success: true });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      error: { code: e.errno, message: e.sqlMessage },
    });
  }
});

/** WEATHER LOGS */
router.post("/log", auth.validate, async (req, res) => {
  try {
    // Deconstruct the parameters from the request body
    const { log, user_id } = req.body;

    // Check if the request body has both log data and user_id
    if (!log || !user_id) {
      throw { sqlMessage: "Insufficient parameters.", errno: 1054 };
    }

    // Build query payload
    const payload = {
      log,
      user_id,
    };

    // Post the log in the database
    const [new_log] = await db("weather_log").insert(payload);
    res.status(200).json({ success: true, log_id: new_log });
  } catch (e) {
    res.status(500).json({
      success: false,
      error: { code: e.errno, message: e.sqlMessage },
    });
  }
});

router.get("/logs/:user_id", auth.validate, async (req, res) => {
  try {
    // Deconstruct the id from the request params
    const { user_id } = req.params;

    // Check if the request parameter exists
    if (!user_id) {
      throw { sqlMessage: "Insufficient parameters.", errno: 1054 };
    }

    // Query the logs in the database
    const logs = await db("weather_log")
      .where({ user_id })
      .orderBy("id")
      .limit(100);

    res
      .status(200)
      .json({ success: true, logs: `{"logs":${JSON.stringify(logs)}}` });
  } catch (e) {
    res.status(500).json({
      success: false,
      error: { code: e.errno, message: e.sqlMessage },
    });
  }
});

/** SESSIONS */
router.get("/session/:session_id", auth.validate, async (req, res) => {
  try {
    // Deconstruct the id from the request params
    const { session_id } = req.params;

    // Check if the request parameter exists
    if (!session_id) {
      throw { sqlMessage: "Insufficient parameters.", errno: 1054 };
    }

    // Query the session in the database
    const session = await db("sessions")
      .first(["id", "user_id"])
      .where({ id: session_id });

    // Check if the session exists
    if (!session) {
      throw { sqlMessage: "Session does not exist.", errno: 1176 };
    } else {
      res.status(200).json({
        success: true,
        user_id: session.user_id,
        session_id: session.id,
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      error: { code: e.errno, message: e.sqlMessage },
    });
  }
});

module.exports = router;
