import React, { useRef, useEffect, useState } from 'react';
import './index.css';

class Ruleta extends React.Component {
    constructor(props) {
      super(props);
      this.canvasRef = React.createRef();
      this.rotation = 0; // Rotación interna, sin usar estado
      this.isSpinning = false; // Control de animación
      this.spinDuration = 5000; // Duración total del giro (ms)
    }
  
    componentDidUpdate(prevProps) {
      if (prevProps.chosenLetter !== this.props.chosenLetter) {
        this.selectedIndex(this.props.letters.indexOf(this.props.chosenLetter));
      }
    }
  
    componentDidMount() {
      this.drawWheel(this.rotation);
    }
  
    drawWheel(rotation) {
      const canvas = this.canvasRef.current;
      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;
      const radius = width / 2;
      const letters = this.props.letters;
      const numSegments = letters.length;
      const angle = (2 * Math.PI) / numSegments;
  
      // Limpiar el canvas
      ctx.clearRect(0, 0, width, height);
  
      // Configurar el contexto
      ctx.save();
      ctx.translate(radius, radius);
      ctx.rotate(rotation);
  
      // Dibujar la ruleta
      letters.forEach((letter, i) => {
        const startAngle = angle * i;
        const endAngle = startAngle + angle;
        ctx.beginPath();
        ctx.arc(0, 0, radius, startAngle, endAngle);
        ctx.lineTo(0, 0);
        ctx.fillStyle = i % 2 === 0 ? '#fff' : '#eee';
        ctx.fill();
        ctx.stroke();
  
        // Dibujar la letra
        ctx.save();
        ctx.rotate(startAngle + angle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#000';
        ctx.font = 'bold 20px Arial';
        ctx.fillText(letter, radius - 10, 10);
        ctx.restore();
      });
  
      // Restaurar el contexto
      ctx.restore();
      
      // Dibujar el marcador
      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.moveTo(width / 2 + 10, 20); // Ajustar posición X
      ctx.lineTo(width / 2 + 50, 20); // Ajustar posición X
      ctx.lineTo(width / 2 + 30, 50); // Ajustar posición X
      ctx.closePath();
      ctx.fill();
    }
  
    spinWheel() {
      const anglePerLetter = (2 * Math.PI) / this.props.letters.length;
      const chosenIndex = this.props.letters.indexOf(this.props.chosenLetter);
      const chosenAngle = anglePerLetter * chosenIndex;
      
      // Calcular la rotación necesaria para que la letra elegida quede en la posición del marcador
      const offsetAngle = anglePerLetter / 2; // Ajustar según la posición del marcador
      const totalRotation = this.rotation + (3 * 2 * Math.PI) + (chosenAngle - offsetAngle); // Giros adicionales + ajuste de la posición
  
      this.isSpinning = true;
      this.animateSpin(this.rotation, totalRotation, this.spinDuration);
    }
  
    animateSpin(startRotation, endRotation, duration) {
      const startTime = performance.now();
  
      const animate = (time) => {
        const elapsedTime = time - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
  
        // Curva de aceleración/desaceleración más suave
        const easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        const easedProgress = easeInOutQuad(progress);
  
        this.rotation = startRotation + (endRotation - startRotation) * easedProgress;
        this.drawWheel(this.rotation);
  
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          this.isSpinning = false;
        }
      };
  
      requestAnimationFrame(animate);
    }
  
    selectedIndex(index) {
      const anglePerLetter = (2 * Math.PI) / this.props.letters.length;
      const chosenAngle = anglePerLetter * index;
      
      // Calcular la rotación necesaria para que la letra elegida quede en la posición del marcador
      const offsetAngle = anglePerLetter / 2; // Ajustar según la posición del marcador
      const totalRotation = this.rotation + (3 * 2 * Math.PI) + (chosenAngle - offsetAngle); // Giros adicionales + ajuste de la posición
  
      this.isSpinning = true;
      this.animateSpin(this.rotation, totalRotation, this.spinDuration);
    }
  
    setIndex(index) {
      const anglePerLetter = (2 * Math.PI) / this.props.letters.length;
      const chosenAngle = anglePerLetter * index;
  
      // Calcular la rotación necesaria para que la letra elegida quede en la posición del marcador
      const offsetAngle = anglePerLetter / 2; // Ajustar según la posición del marcador
      const totalRotation = chosenAngle - offsetAngle;
  
      this.rotation = totalRotation;
      this.drawWheel(this.rotation);
    }
  
    render() {
      return (
        <div className="wheel-container">
          <canvas ref={this.canvasRef} width={500} height={500} />
          <button onClick={() => this.spinWheel()} disabled={this.isSpinning}>
            {this.isSpinning ? 'Girando...' : 'Girar Ruleta'}
          </button>
        </div>
      );
    }
  }

export default Ruleta