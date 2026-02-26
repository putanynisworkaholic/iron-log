import React from "react";

export default function Collapse({ open, children }) {
  return (
    <div className={`collapse-content ${open ? "open" : ""}`}>
      <div className="collapse-inner">
        {children}
      </div>
    </div>
  );
}
