// // functions/authService.js
// const admin = require('firebase-admin');

import { list } from "postcss"

// // Firebase Admin SDK 초기화
// if (!admin.apps.length) {
//   admin.initializeApp();
// }

// /**
//  * 사용자에게 커스텀 클레임으로 역할을 설정하는 함수
//  * @param {string} uid - 사용자 UID
//  * @param {string} role - 설정할 역할 (예: "Manager")
//  * @returns {Promise<void>}
//  */
// const setUserRole = async (uid, role) => {
//   try {
//     await admin.auth().setCustomUserClaims(uid, { role });
//     console.log(`✅ 사용자 ${uid}에게 역할 ${role} 설정 완료`);
//   } catch (error) {
//     console.error(`❌ 사용자 ${uid} 역할 설정 실패:`, error);
//     throw new Error('역할 설정 실패');
//   }
// };

// /**
//  * 사용자의 현재 역할을 가져오는 함수
//  * @param {string} uid - 사용자 UID
//  * @returns {Promise<string|null>} - 사용자의 역할 또는 null
//  */
// const getUserRole = async (uid) => {
//   try {
//     const user = await admin.auth().getUser(uid);
//     const role = user.customClaims?.role || null;
//     console.log(`✅ 사용자 ${uid}의 역할: ${role}`);
//     return role;
//   } catch (error) {
//     console.error(`❌ 사용자 ${uid} 역할 조회 실패:`, error);
//     throw new Error('역할 조회 실패');
//   }
// };

// module.exports = {
//   setUserRole,
//   getUserRole,
// };