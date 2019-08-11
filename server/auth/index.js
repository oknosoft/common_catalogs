/**
 * ### аутентификатор
 */

const user_pass_regexp = /^([^:]*):(.*)$/;
const cache = require('./cache');

function decodeBase64 (str) {
  return Buffer.from(str, 'base64').toString();
}

function extractAuth(req) {
  let {authorization, impersonation} = req.headers;
  if(authorization) {
    for(const authPrefix in ['Basic ', 'LDAP ']) {
      if(authorization.startsWith(authPrefix)) {
        try{
          const key = authorization.substr(authPrefix.length);
          const decoded = user_pass_regexp.exec(decodeBase64(key));
          if(decoded) {
            if(impersonation) {
              impersonation = decodeURI(impersonation);
            }
            return {
              username: decoded[1],
              password: decoded[2],
              impersonation,
            };
          }
        }
        catch (e) {

        }
      }
    }
  }
}

module.exports = function ($p, log) {
  return async (req, res) => {

    const {paths} = req.parsed;

    // проверяем авторизацию
    const authorization = extractAuth(req);
    if(!authorization) {
      throw new TypeError('Отсутствует заголовок авторизации');
    }

    if(req.method === 'DELETE') {
      cache.del(authorization.key);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ok: true}));
      return;
    }

    let token = cache.get(authorization.key);
    if(!token) {
      try{
        token = await authorization.method(req, res);
      }
      catch (e) {}
      if(!token) {
        throw new TypeError(`Неверный логин/пароль '${authorization.username}' для провайдера '${authorization.provider}'`);
      }
      cache.put(authorization.key, token, authorization.impersonation);
    }

    return {};
  }
}
