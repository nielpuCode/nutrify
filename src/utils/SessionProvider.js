// src/utils/SessionProvider.js
"use client";
const React = require("react");
const { SessionProvider } = require("next-auth/react"); // https://www.npmjs.com/package/next-auth/v/4.23.1

const AuthProvider = ({ children }) => {
    return <SessionProvider>{children}</SessionProvider>;
};

module.exports = AuthProvider;
