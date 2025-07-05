import React from 'react'

const HomePage = () => {
  return (
    <section className="min-h-screen flex flex-col items-center mt-14 px-4">
      <div >
        <h1 className="text-4xl font-extrabold z-10 text-center">
          Welcome to <span className="text-primary">Leet Spark</span>
        </h1>
        <p className="mt-4 text-center text-lg font-semibold text-gray-500 dark:text-gray-400 z-10">
          A Platform Inspired by Leetcode which helps you to prepare for coding interviews and helps you to improve your
          coding skills by solving coding problems
        </p>
      </div>
    </section>
  )
}

export default HomePage