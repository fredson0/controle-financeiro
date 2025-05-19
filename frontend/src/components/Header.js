import React from "react";

const Header = () => {
  return (
    <header style={styles.header}>
      <h1>Finance App</h1>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "15px",
    textAlign: "center",
  },
};

export default Header;