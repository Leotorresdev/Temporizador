import { useEffect } from "react";

export default function GenerateIcons() {
  useEffect(() => {
    const generateIcon = (size: number) => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");

      if (!ctx) return null;

      // Fondo
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, size, size);

      // Círculo principal
      ctx.fillStyle = "#0ea5e9";
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size * 0.4, 0, 2 * Math.PI);
      ctx.fill();

      // Texto "T"
      ctx.fillStyle = "#ffffff";
      ctx.font = `bold ${size * 0.3}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("T", size / 2, size / 2);

      return canvas.toDataURL("image/png");
    };

    const sizes = [192, 512];
    sizes.forEach(size => {
      const iconData = generateIcon(size);
      if (iconData) {
        // Guardar en localStorage para uso posterior
        localStorage.setItem(`icon-${size}`, iconData);
      }
    });
  }, []);

  return null;
}