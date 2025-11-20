import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AirportCard, type Airport } from "../../card/AirportCard";

// Mock mejorado de next/image que filtra props no-HTML
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // Filtra props que no son válidas para <img>
    const {
      fill,
      priority,
      loading,
      quality,
      placeholder,
      blurDataURL,
      ...validProps
    } = props;
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...validProps} data-testid="next-image" />;
  },
}));

// Mock de lucide-react
jest.mock("lucide-react", () => ({
  Plane: () => <svg data-testid="plane-icon">Plane</svg>,
}));

describe("AirportCard", () => {
  const mockAirport: Airport = {
    airport_name: "Aeropuerto Internacional El Dorado",
    iata_code: "BOG",
    icao_code: "SKBO",
    country_name: "Colombia",
    city_iata_code: "BOG",
  };

  describe("Renderizado básico", () => {
    it("renderiza el nombre del aeropuerto correctamente", () => {
      render(<AirportCard a={mockAirport} />);

      expect(
        screen.getByText("Aeropuerto Internacional El Dorado")
      ).toBeInTheDocument();
    });

    it("renderiza el código IATA cuando está disponible", () => {
      render(<AirportCard a={mockAirport} />);

      expect(screen.getByText("BOG")).toBeInTheDocument();
    });

    it("renderiza el país y ciudad", () => {
      render(<AirportCard a={mockAirport} />);

      expect(screen.getByText("BOG, Colombia")).toBeInTheDocument();
    });

    it("muestra el icono de avión", () => {
      render(<AirportCard a={mockAirport} />);

      expect(screen.getByTestId("plane-icon")).toBeInTheDocument();
    });

    it('renderiza la etiqueta "Aeropuerto Internacional"', () => {
      render(<AirportCard a={mockAirport} />);

      expect(screen.getByText("Aeropuerto Internacional")).toBeInTheDocument();
    });

    it("renderiza la imagen de fondo", () => {
      render(<AirportCard a={mockAirport} />);

      // Verificar que existe la imagen mockeada
      const image = screen.getByTestId("next-image");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("alt", "");
    });
  });

  describe("Lógica de fallback de códigos", () => {
    it("usa código IATA si está disponible", () => {
      render(<AirportCard a={mockAirport} />);

      expect(screen.getByText("BOG")).toBeInTheDocument();
    });

    it("usa código ICAO cuando IATA es null", () => {
      const airportSinIATA: Airport = {
        ...mockAirport,
        iata_code: null,
      };

      render(<AirportCard a={airportSinIATA} />);

      expect(screen.getByText("SKBO")).toBeInTheDocument();
    });

    it('muestra "—" cuando ambos códigos son null', () => {
      const airportSinCodigos: Airport = {
        ...mockAirport,
        iata_code: null,
        icao_code: null,
      };

      render(<AirportCard a={airportSinCodigos} />);

      const codeElements = screen.getAllByText("—");
      expect(codeElements.length).toBeGreaterThanOrEqual(1);
    });

    it("usa código ICAO cuando IATA es string vacío", () => {
      const airportIATAVacio: Airport = {
        ...mockAirport,
        iata_code: "",
      };

      render(<AirportCard a={airportIATAVacio} />);

      expect(screen.getByText("SKBO")).toBeInTheDocument();
    });
  });

  describe("Valores null/undefined", () => {
    it('muestra "—" cuando airport_name es null', () => {
      const airportSinNombre: Airport = {
        ...mockAirport,
        airport_name: null,
      };

      render(<AirportCard a={airportSinNombre} />);

      const dashElements = screen.getAllByText("—");
      expect(dashElements.length).toBeGreaterThan(0);
    });

    it('muestra "—" cuando country_name es null', () => {
      const airportSinPais: Airport = {
        ...mockAirport,
        country_name: null,
      };

      render(<AirportCard a={airportSinPais} />);

      expect(screen.getByText("BOG, —")).toBeInTheDocument();
    });

    it('muestra "—" cuando city_iata_code es null', () => {
      const airportSinCiudad: Airport = {
        ...mockAirport,
        city_iata_code: null,
      };

      render(<AirportCard a={airportSinCiudad} />);

      expect(screen.getByText("—, Colombia")).toBeInTheDocument();
    });

    it("maneja todos los valores null correctamente", () => {
      const airportVacio: Airport = {
        airport_name: null,
        iata_code: null,
        icao_code: null,
        country_name: null,
        city_iata_code: null,
      };

      render(<AirportCard a={airportVacio} />);

      // Verifica que no lanza errores
      expect(screen.getByText("Aeropuerto Internacional")).toBeInTheDocument();
    });
  });

  describe("Interactividad", () => {
    it("llama a onClick cuando se hace click en la card", async () => {
      const onClickMock = jest.fn();
      const user = userEvent.setup();

      render(<AirportCard a={mockAirport} onClick={onClickMock} />);

      const card = screen.getByRole("article");
      await user.click(card);

      expect(onClickMock).toHaveBeenCalledTimes(1);
    });

    it("no lanza error si onClick no está definido", async () => {
      const user = userEvent.setup();

      render(<AirportCard a={mockAirport} />);

      const card = screen.getByRole("article");

      await expect(user.click(card)).resolves.not.toThrow();
    });

    it("es clickeable múltiples veces", async () => {
      const onClickMock = jest.fn();
      const user = userEvent.setup();

      render(<AirportCard a={mockAirport} onClick={onClickMock} />);

      const card = screen.getByRole("article");
      await user.click(card);
      await user.click(card);
      await user.click(card);

      expect(onClickMock).toHaveBeenCalledTimes(3);
    });
  });

  describe("Estilos y clases CSS", () => {
    it("tiene la clase article como elemento raíz", () => {
      render(<AirportCard a={mockAirport} />);

      const card = screen.getByRole("article");
      expect(card).toBeInTheDocument();
    });

    it("aplica clases de hover y transición", () => {
      const { container } = render(<AirportCard a={mockAirport} />);

      const card = container.querySelector("article");
      expect(card).toHaveClass("transition", "hover:shadow-lg");
    });

    it("el código se muestra con estilos destacados", () => {
      render(<AirportCard a={mockAirport} />);

      const codeElement = screen.getByText("BOG");
      expect(codeElement).toHaveClass(
        "text-3xl",
        "font-extrabold",
        "text-sky-300"
      );
    });
  });

  describe("Truncado de texto", () => {
    it("trunca nombres largos con line-clamp-2", () => {
      const airportNombreLargo: Airport = {
        ...mockAirport,
        airport_name:
          "Aeropuerto Internacional Muy Largo Con Muchas Palabras Que Deberían Truncarse",
      };

      const { container } = render(<AirportCard a={airportNombreLargo} />);

      const nameElement = container.querySelector(".line-clamp-2");
      expect(nameElement).toBeInTheDocument();
      expect(nameElement?.textContent).toContain(
        "Aeropuerto Internacional Muy Largo"
      );
    });
  });

  describe("Accesibilidad", () => {
    it("usa el tag semántico article", () => {
      render(<AirportCard a={mockAirport} />);

      expect(screen.getByRole("article")).toBeInTheDocument();
    });

    it("la imagen de fondo tiene alt vacío (decorativa)", () => {
      render(<AirportCard a={mockAirport} />);

      const image = screen.getByTestId("next-image");
      expect(image).toHaveAttribute("alt", "");
    });

    it("mantiene jerarquía de headings correcta", () => {
      const { container } = render(<AirportCard a={mockAirport} />);

      const heading = container.querySelector("h3");
      expect(heading).toBeInTheDocument();
      expect(heading?.textContent).toBe("Aeropuerto Internacional El Dorado");
    });
  });

  describe("Layout y estructura", () => {
    it("tiene grid con 2 columnas en el contenido principal", () => {
      const { container } = render(<AirportCard a={mockAirport} />);

      const grid = container.querySelector(".grid-cols-\\[1fr\\,120px\\]");
      expect(grid).toBeInTheDocument();
    });

    it("renderiza el gradiente sobre la imagen de fondo", () => {
      const { container } = render(<AirportCard a={mockAirport} />);

      const gradient = container.querySelector(".bg-gradient-to-r");
      expect(gradient).toBeInTheDocument();
    });
  });

  describe("Edge cases", () => {
    it("maneja strings vacíos como null", () => {
      const airportVacio: Airport = {
        airport_name: "",
        iata_code: "",
        icao_code: "",
        country_name: "",
        city_iata_code: "",
      };

      render(<AirportCard a={airportVacio} />);

      // Buscar todos los "—" en el documento
      const dashElements = screen.getAllByText("—");
      expect(dashElements.length).toBeGreaterThan(0);
    });

    it("maneja correctamente mezcla de null y valores", () => {
      const airportMixto: Airport = {
        airport_name: "Test Airport",
        iata_code: null,
        icao_code: "TEST",
        country_name: null,
        city_iata_code: "TST",
      };

      render(<AirportCard a={airportMixto} />);

      expect(screen.getByText("Test Airport")).toBeInTheDocument();
      expect(screen.getByText("TEST")).toBeInTheDocument();
      expect(screen.getByText("TST, —")).toBeInTheDocument();
    });
  });
});
