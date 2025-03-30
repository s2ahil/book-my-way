"use client"
import React, { useState, useEffect } from 'react';
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const TicketBooking = () => {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      signIn();
    },
  });

  const [seats, setSeats] = useState([]);
  const [numSeatsToBook, setNumSeatsToBook] = useState("");
  const [loading, setLoading] = useState(false);
  // New state to track recently booked seats
  const [recentlyBookedSeats, setRecentlyBookedSeats] = useState([]);

  // Redirect to login if no session
  useEffect(() => {
    if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);

  // Initialize seats with row structure
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/seats")
        .then((res) => res.json())
        .then(data => {
          console.log("actual data coming", data);
          
          // If API returns data, use it
          if (data && data.length > 0) {
            setSeats(data);
          } else {
            alert("error while fetching seats");
     
          }
        })
        .catch(() => {
          console.log("error while fetching seats");
          alert("error while fetching seats");
      
        });
    }
  }, [status]);


  if (status === "loading" || seats.length === 0) {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return null;
  }

  const suggestSeats = () => {
    const numSeats = parseInt(numSeatsToBook);
    if (isNaN(numSeats) || numSeats < 1 || numSeats > 7) {
      alert("Please enter a number between 1 and 7.");
      return [];
    }

    // Create row-wise grouping of available seats
    const availableByRow = {};
    seats.forEach(seat => {
      if (!seat.isBooked) {
        if (!availableByRow[seat.row]) {
          availableByRow[seat.row] = [];
        }
        availableByRow[seat.row].push(seat.id);
      }
    });

    // First priority: Find a row with enough consecutive seats
    for (const row in availableByRow) {
      if (availableByRow[row].length >= numSeats) {
        // Sort seats by seat number in row to get consecutive seats
        const rowSeats = seats
          .filter(seat => seat.row.toString() === row && !seat.isBooked)
          .sort((a, b) => a.seat - b.seat);

        for (let i = 0; i <= rowSeats.length - numSeats; i++) {
          let consecutive = true;
          for (let j = 0; j < numSeats - 1; j++) {
            if (rowSeats[i + j].seat + 1 !== rowSeats[i + j + 1].seat) {
              consecutive = false;
              break;
            }
          }

          if (consecutive) {
            return rowSeats.slice(i, i + numSeats).map(seat => seat.id);
          }
        }

        // If no consecutive seats, just take the first numSeats from the row
        return rowSeats.slice(0, numSeats).map(seat => seat.id);
      }
    }

    // Second priority: Take seats from multiple rows that are as close as possible
    let allAvailableSeats = seats.filter(seat => !seat.isBooked)
      .sort((a, b) => a.row - b.row || a.seat - b.seat)
      .map(seat => seat.id);

    return allAvailableSeats.slice(0, numSeats);
  };

  // const resetBooking = () => {
  //   setNumSeatsToBook("");
  //   setRecentlyBookedSeats([]);
  // };

  const bookSeats = async () => {
    if (!session) {
      signIn();
      return;
    }

    if (numSeatsToBook === "") {
      alert("Please enter the number of seats you want to book.");
      return;
    }

    const seatsToBook = suggestSeats();
    if (seatsToBook.length === 0) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/seats/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seatIds: seatsToBook }),
      });

      setLoading(false);

      if (res.ok) {
        alert("Seats booked successfully!");

        // Get seat details for the recently booked seats
        const bookedSeatDetails = seats
          .filter(seat => seatsToBook.includes(seat.id))
          .map(seat => ({
            id: seat.id,
            row: seat.row,
            seat: seat.seat,
            // Calculate the actual seat number (1-80)
            seatNumber: seat.id
          }));

        // Update recently booked seats with the current booking
        setRecentlyBookedSeats(bookedSeatDetails);

        // Update seats state to mark these as booked
        setSeats((prev) =>
          prev.map((s) =>
            seatsToBook.includes(s.id) ? { ...s, isBooked: true } : s
          )
        );

        setNumSeatsToBook("");
      } else {
        alert("Booking failed");
      }
    } catch (error) {
      setLoading(false);
      alert("Booking failed: " + error.message);
    }
  };

  const getSeatColor = (seat) => {
    if (recentlyBookedSeats.some(bookedSeat => bookedSeat.id === seat.id)) {
      return 'bg-yellow-400';
    }
    return seat.isBooked ? 'bg-yellow-400' : 'bg-green-500';
  };

  const availableSeats = seats.filter(seat => !seat.isBooked).length;
  const bookedSeats = seats.length - availableSeats;

  // Sort seats by ID to ensure they appear in proper order from 1-80
  const sortedSeats = [...seats].sort((a, b) => a.id - b.id);

  const SEATS_PER_ROW = 7; // Number of seats per row in the grid display

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-xl font-bold mb-4">Ticket Booking</h1>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-2/3">
            <div className="grid grid-cols-7 gap-2">
              {sortedSeats.map(seat => (
                <button
                  key={seat.id}
                  className={`${getSeatColor(seat)} rounded-md py-2 font-medium transition-colors`}
                  disabled={true}
                >
                  {seat.id}
                </button>
              ))}
            </div>

            <div className="mt-6 flex gap-4">
              <div className="bg-yellow-400 text-black px-4 py-2 rounded-md">
                Booked Seats = {bookedSeats}
              </div>
              <div className="bg-green-500 text-black px-4 py-2 rounded-md">
                Available Seats = {availableSeats}
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/3 flex flex-col gap-4">
            <h2 className="text-lg font-medium">Book Seats</h2>

            <input
              type="number"
              min="1"
              max="7"
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter number of seats"
              value={numSeatsToBook}
              onChange={(e) => setNumSeatsToBook(e.target.value)}
            />

            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
              onClick={bookSeats}
              disabled={loading}
            >
              Book
            </button>

            {/* <button
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
              onClick={resetBooking}
              disabled={loading}
            >
              Reset Booking
            </button> */}

            {/* Recently Booked Seats Section */}
            {recentlyBookedSeats.length > 0 && (
              <div className="mt-4 bg-white p-4 rounded-md shadow">
                <h3 className="text-lg font-medium mb-2">Recently Booked Seats</h3>
                <div className="flex flex-col gap-2">
                  {recentlyBookedSeats.map(seat => (
                    <div key={seat.id} className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-yellow-400 rounded-md flex items-center justify-center font-medium">
                        {seat.id}
                      </div>
                      <span>Row {seat.row}, Seat {seat.seat}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Total seats booked: {recentlyBookedSeats.length}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketBooking;