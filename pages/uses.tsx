import React from "react";

const Uses = () => {
  return (
    <div className="nf-w-full">
      <div>
        <h1 className="nf-text-3xl nf-font-semibold nf-mt-4 nf-mb-8">Uses</h1>
      </div>
      <div className="nf-flex nf-justify-center">
        <div>
          <img src="/desktop-setup.jpg" alt="Desktop setup" />
        </div>
      </div>
      <div className="nf-my-8">
        <div className="nf-my-4">
          <h2 className="nf-font-medium nf-text-xl">Editor</h2>
          <ul>
            <li className="nf-list-disc nf-ml-8">Vs Code</li>
            <li className="nf-list-disc nf-ml-8">Vim</li>
            <li className="nf-list-disc nf-ml-8">Obsidian (Markdown editor)</li>
          </ul>
        </div>
        <div className="nf-my-4">
          <h2 className="nf-font-medium nf-text-xl">Laptop and Peripherals</h2>
          <ul>
            <li className="nf-list-disc nf-ml-8">
              Lenovo T460s Laptop- 14inch
            </li>
            <li className="nf-list-disc nf-ml-8">
              Dell U2712D Monitor - 27 inch
            </li>
            <li className="nf-list-disc nf-ml-8">Logitech K235 Keyboard</li>
            <li className="nf-list-disc nf-ml-8">Logitech M170 Mouse</li>
          </ul>
        </div>
        <div className="nf-my-4">
          <h2 className="nf-font-medium nf-text-xl">OS and Configuration</h2>
          <ul>
            <li className="nf-list-disc nf-ml-8">Ubuntu 20.04</li>
            <li className="nf-list-disc nf-ml-8">i3 window manager</li>
            <li className="nf-list-disc nf-ml-8">Polybar</li>
            <li className="nf-list-disc nf-ml-8">Rofi</li>
            <li className="nf-list-disc nf-ml-8">Picom</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Uses;
