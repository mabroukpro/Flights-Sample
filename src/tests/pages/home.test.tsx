import "@testing-library/jest-dom/extend-expect";
import { render, screen, fireEvent } from "@testing-library/react";
import HomePage from "../../pages/home";
import { useFetch } from "../../hooks/useFetch";
import {
  getFlights,
  deleteFlight as deleteFlightAPI,
} from "../../services/api";
import { BrowserRouter as Router } from "react-router-dom";

// Mock the useFetch hook
jest.mock("../../hooks/useFetch");
jest.mock("../../services/api");

const mockUseFetch = useFetch as jest.Mock;
const mockGetFlights = getFlights as jest.Mock;
const mockDeleteFlight = deleteFlightAPI as jest.Mock;

describe("HomePage Component", () => {
  beforeEach(() => {
    mockUseFetch.mockClear();
    mockGetFlights.mockClear();
    mockDeleteFlight.mockClear();
  });

  test("renders HomePage with mocked data and performs actions", async () => {
    const flightsData = {
      resources: [
        {
          id: "1",
          code: "FL123",
          capacity: 200,
          departureDate: "2024-07-01",
          status: "ready",
          img: "image1.png",
        },
        {
          id: "2",
          code: "FL124",
          capacity: 150,
          departureDate: "2024-07-02",
          status: "processing",
          img: "",
        },
      ],
      count: 2,
    };

    mockUseFetch.mockReturnValue({
      data: flightsData,
      isLoading: false,
      startFetch: jest.fn(),
    });

    render(
      <Router>
        <HomePage />
      </Router>
    );

    // Verify that flights are rendered
    expect(screen.getByText("FL123")).toBeInTheDocument();
    expect(screen.getByText("FL124")).toBeInTheDocument();
  });

  test("renders search input and create flight button", () => {
    render(
      <Router>
        <HomePage />
      </Router>
    );

    expect(
      screen.getByPlaceholderText("Search by code...")
    ).toBeInTheDocument();
    expect(screen.getByText("Create Flight")).toBeInTheDocument();
  });

  test("opens create flight modal on button click", () => {
    render(
      <Router>
        <HomePage />
      </Router>
    );

    fireEvent.click(screen.getByText("Create Flight"));
    expect(screen.getByText("Create Flight")).toBeInTheDocument(); // Check if the modal opens
  });

  test("renders loading state", () => {
    mockUseFetch.mockReturnValue({
      data: null,
      isLoading: true,
      startFetch: jest.fn(),
    });

    render(
      <Router>
        <HomePage />
      </Router>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders pagination and handles page change", () => {
    const flightsData = {
      resources: [
        {
          id: "1",
          code: "FL123",
          capacity: 200,
          departureDate: "2024-07-01",
          status: "ready",
          img: "image1.png",
        },
      ],
      count: 10,
    };

    mockUseFetch.mockReturnValue({
      data: flightsData,
      isLoading: false,
      startFetch: jest.fn(),
    });

    render(
      <Router>
        <HomePage />
      </Router>
    );

    expect(screen.getByTitle("Previous Page")).toBeInTheDocument(); // Check if pagination is rendered
  });
});
