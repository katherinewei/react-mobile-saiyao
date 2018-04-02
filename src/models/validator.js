import jwtDecode from 'jwt-decode'

const VALIDATOR_KEY = 'user';
const ACCESS_TOKEN_KEY = 'access_token';
const ACCESS_DEVICE_ID = 'access_deviceId';
const ACCESS_OPERATOR_ID = 'access_operatorId';

const ROLE_KEY = 'rol';
const ROLE_USER = 'operator';
const ROLE_ADMIN = 'employee';

const ACCESS_OPENID = 'access_openid';
const ACCESS_SN_KEY = 'access_sn';
const ACCESS_CNO = 'access_cno';

let user = null

export function loadValidator() {
    if (user) {
        return user
    }
    user = localStorage.getItem(VALIDATOR_KEY)
    if (!user) {
        return null
    }
    user = JSON.parse(user)
    //console.log(user)
    return user
}

export function saveValidator(obj) {
    user = obj
    localStorage.setItem(VALIDATOR_KEY, JSON.stringify(user))
}

export function clearValidator() {
    user = null
    localStorage.removeItem(VALIDATOR_KEY)
}

export function getAccessToken() {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY)
    return token;

}

export function setAccessToken(token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export function getAccessDeviceId() {
    const DeviceId = localStorage.getItem(ACCESS_DEVICE_ID)
    return DeviceId;

}

export function setAccessDeviceId(DeviceId) {
    localStorage.setItem(ACCESS_DEVICE_ID, DeviceId)
}

export function getAccessOperatorId() {
    const OperatorId = localStorage.getItem(ACCESS_OPERATOR_ID)
    return OperatorId;

}

export function setAccessOperatorId(OperatorId) {
    localStorage.setItem(ACCESS_OPERATOR_ID, OperatorId)
}

export function getAccessOpendId() {
    const openid = localStorage.getItem(ACCESS_OPENID)
    return openid;

}

export function setAccessOpendId(openid) {
    localStorage.setItem(ACCESS_OPENID, openid)
}

export function getAccessSN() {
    const sn = localStorage.getItem(ACCESS_SN_KEY)
    return sn;
}

export function setAccessSN(sn) {
    localStorage.setItem(ACCESS_SN_KEY, sn)
}
export function getAccessCNO() {
    const sn = localStorage.getItem(ACCESS_CNO)
    return sn;
}

export function setAccessCNO(CNO) {
    localStorage.setItem(ACCESS_CNO, CNO)
}


function getRole() {
    //const validator = loadValidator()
    //if (!validator) {
      //  return undefined
    //}
    //console.log(getAccessToken())
    const decoded = jwtDecode(getAccessToken())
    return decoded
}

export function isAdmin() {
    return getRole() === ROLE_ADMIN
}

export function UserId() {
    return getRole().oid;
}
