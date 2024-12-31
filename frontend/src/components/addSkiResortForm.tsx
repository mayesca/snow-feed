import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import {
  SkiResort,
  emptySkiResort,
  skiResortApi,
} from "../gateway/skiResortApi.tsx";
import { ErrorModal } from "./errorModal.tsx";
import { SuccessCheck } from "./successCheck.tsx";

interface AddSkiResortFormProps {
  resorts: SkiResort[];
  setResorts: (resorts: SkiResort[]) => void;
}

class HttpError extends Error {
  response?: { data?: { error?: string } | string };
  constructor(message: string, public status: number) {
    super(message);
    this.name = "HttpError";
  }
}

export const AddSkiResortForm: React.FC<AddSkiResortFormProps> = ({
  resorts,
  setResorts,
}) => {
  const [resort, setResort] = useState<SkiResort>(emptySkiResort);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await skiResortApi.postSkiResort(resort);
      setResorts([...resorts, response]);
      setResort(emptySkiResort);
      setShowSuccess(true);
    } catch (error: unknown) {
      const httpError = error as HttpError;
      console.log("Error details:", httpError);
      setErrorMessage(
        (typeof httpError.response?.data === "object" &&
          httpError.response.data?.error) ||
          (typeof httpError.response?.data === "string" &&
            httpError.response.data) ||
          httpError.message ||
          "An unexpected error occurred while adding the ski resort"
      );
      setShowError(true);
    }
  };

  const handleClear = () => {
    setResort(emptySkiResort);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
          Add New Ski Resort
        </h3>
        <Form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Group>
              <Form.Label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </Form.Label>
              <Form.Control
                type="text"
                value={resort.name}
                onChange={(e) => setResort({ ...resort, name: e.target.value })}
                required
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter the name of the ski resort"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label className="block text-sm font-medium text-gray-700 mb-2">
                Region
              </Form.Label>
              <Form.Control
                type="text"
                value={resort.region}
                onChange={(e) =>
                  setResort({ ...resort, region: e.target.value })
                }
                required
                placeholder="Enter the region of the ski resort"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </Form.Group>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Form.Group>
              <Form.Label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </Form.Label>
              <Form.Control
                type="text"
                value={resort.state}
                onChange={(e) =>
                  setResort({ ...resort, state: e.target.value })
                }
                required
                placeholder="Enter the state of the ski resort"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label className="block text-sm font-medium text-gray-700 mb-2">
                Latitude
              </Form.Label>
              <Form.Control
                type="number"
                step="any"
                value={resort.latitude}
                onChange={(e) =>
                  setResort({ ...resort, latitude: parseFloat(e.target.value) })
                }
                required
                placeholder="-90 to 90"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label className="block text-sm font-medium text-gray-700 mb-2">
                Longitude
              </Form.Label>
              <Form.Control
                type="number"
                value={resort.longitude}
                onChange={(e) =>
                  setResort({
                    ...resort,
                    longitude: parseFloat(e.target.value),
                  })
                }
                required
                placeholder="-180 to 180"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </Form.Group>
          </div>

          <div className="flex justify-end pt-4 space-x-4">
            <Button
              variant="secondary"
              type="button"
              onClick={handleClear}
              className="px-6 py-2 bg-gray-500 text-white font-medium rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transform transition-transform hover:scale-105"
            >
              Clear Form
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-transform hover:scale-105"
            >
              Add Resort
            </Button>
          </div>
        </Form>
      </div>

      {showSuccess && <SuccessCheck onComplete={() => setShowSuccess(false)} />}

      <ErrorModal
        show={showError}
        onHide={() => setShowError(false)}
        errorMessage={errorMessage}
      />
    </>
  );
};
