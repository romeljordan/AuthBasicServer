const crypto = require('crypto')

class Auth {
  async validate(req, res, next) {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      res.status(401).json({ success: false, data: 'Unauthorized.' })
    } else {
      const token = authHeader.split(' ')[1]
      const hash = crypto.createHash('sha256').update(token).digest('base64')
      if (token && hash === process.env.SECRET_KEY) {
        next()
      } else {
        res.status(401).json({ success: false, data: 'Unauthorized.' })
      }
    }
  }
}

module.exports = new Auth()