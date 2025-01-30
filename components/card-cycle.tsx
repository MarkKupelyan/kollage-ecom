"use client";

import React from "react";
import styled from "styled-components";

// Pole s cestami k obrázku
const images = [
  "/01.jpg",
  "/02.jpg",
  "/vlt.jpg",
  "/01.jpg", // Opakování obrázků, pokud jich máte méně
  "/02.jpg",
  "/vlt.jpg",
  "/01.jpg",
  "/02.jpg",
  "/vlt.jpg",
  "/01.jpg",
];

const Card = () => {
  return (
    <StyledWrapper>
      <div className="wrapper">
        <div
          className="inner"
          style={{ "--quantity": images.length } as React.CSSProperties}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="card"
              style={
                {
                  "--index": index,
                  "--color-card": `142, ${249 - index * 20}, 252`,
                } as React.CSSProperties
              }
            >
              <div className="img">
                <img src={image} alt={`Card ${index + 1}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .wrapper {
    width: 100%;
    height: 100vh; /* Plná výška obrazovky */
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: #ffffff; /* Bílé pozadí */
  }

  .inner {
    --w: 200px; /* Šířka karty */
    --h: 300px; /* Výška karty */
    --translateZ: calc(var(--w) + var(--h));
    --rotateX: -15deg;
    --perspective: 1000px;
    position: absolute;
    width: var(--w);
    height: var(--h);
    transform-style: preserve-3d;
    transform: perspective(var(--perspective)) rotateX(var(--rotateX));
    animation: partial-rotate 6s ease-in-out infinite; /* Animace částečného otáčení */
  }

  @keyframes partial-rotate {
    0% {
      transform: perspective(var(--perspective)) rotateX(var(--rotateX))
        rotateY(-45deg); /* Počáteční otočení */
    }
    50% {
      transform: perspective(var(--perspective)) rotateX(var(--rotateX))
        rotateY(45deg); /* Otočení na druhou stranu */
    }
    100% {
      transform: perspective(var(--perspective)) rotateX(var(--rotateX))
        rotateY(-45deg); /* Návrat do výchozí polohy */
    }
  }

  .card {
    position: absolute;
    border: 2px solid rgba(var(--color-card), 1);
    border-radius: 12px;
    overflow: hidden;
    inset: 0;
    transform: rotateY(calc((360deg / var(--quantity)) * var(--index)))
      translateZ(var(--translateZ));
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(var(--color-card), 0.2);
  }

  .img {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .img img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Obrázek vyplní celou kartu */
    border-radius: 10px; /* Zaoblení rohů obrázku */
  }
`;

export default Card;
