import React from "react";

const Card = () => {
  return (
    <div className="nf-max-w-sm nf-mx-4 nf-my-4 nf-bg-white nf-rounded-lg nf-border nf-border-gray nf-shadow-md">
      <a href="#">
        <img
          className="nf-rounded-t-lg"
          src="https://images.unsplash.com/photo-1662368357622-d840d7f5ab60?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
          alt="project card"
        />
      </a>
      <div className="nf-py-5 nf-px-4">
        <a href="#">
          <h5 className="nf-mb-2 nf-text-xl nf-font-bold nf-tracking-normal nf-text-gray-900">
            Noteworthy technology acquisitions 2021
          </h5>
        </a>
        <p className="nf-mb-3 nf-font-normal nf-text-left nf-text-gray-700">
          Here are the biggest enterprise technology acquisitions of 2021 so
          far, in reverse chronological order.
        </p>
      </div>
    </div>
  );
};

export default Card;
