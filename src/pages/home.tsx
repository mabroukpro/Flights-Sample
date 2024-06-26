import { useEffect, useMemo, useState } from "react";
import { deleteFlight as deleteFlightAPI, getFlights } from "../services/api";
import { useFetch } from "../hooks/useFetch";
import CustomTable from "../components/customTable";
import type { TableColumn } from "../components/customTable";
import PageContainer from "../components/pageContainer";
import { useFilters } from "../hooks/useFilters";
import { Button, Dropdown, MenuProps, Modal, Pagination, Select } from "antd";
import SearchInput from "../components/searchInput";
import FlightModal from "../components/modals/Flight";
import { Eye } from "@phosphor-icons/react";
import {
  DotsThreeVertical,
  PencilSimple,
  Spinner,
  TrashSimple,
} from "@phosphor-icons/react";
import ImagePreviewModal from "../components/modals/imagePreview";

/**
 * HomePage component handles the display and management of flights.
 * Includes functionalities to view, create, edit, and delete flights.
 */
function HomePage() {
  const [flightModal, setFlightModal] = useState({
    isOpen: false,
    flight: null,
  });
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState({
    id: "",
    isOpen: false,
  });
  const [imagePreviewModal, setImagePreviewModal] = useState({
    id: "",
    isOpen: false,
  });

  const query = useMemo(() => new URLSearchParams(window.location.search), []);

  /**
   * Validates if the provided value is a valid page number.
   * @param value - The value to be validated.
   * @returns boolean indicating if the value is a valid page number.
   */
  const isValidPageNumber = (value: any) => {
    if (value === undefined || value === null) return true;
    const number = parseInt(value, 10);
    return !isNaN(number) && number > 0;
  };

  /**
   * Validates if the provided value is a valid page size.
   * @param value - The value to be validated.
   * @returns boolean indicating if the value is a valid page size.
   */
  const isValidPageSize = (value: any) => {
    if (value === undefined || value === null) return true;
    const number = parseInt(value, 10);
    return !isNaN(number) && number > 0 && number <= 100; // assuming 100 is the max allowed page size
  };

  useEffect(() => {
    if (
      !isValidPageNumber(query.get("page")) ||
      !isValidPageSize(query.get("size"))
    ) {
      throw new Error("Invalid query parameters");
    }
  }, [query]);

  const initialFilters = {
    page: query.get("page") ? parseInt(query.get("page") as string) : 1,
    size: query.get("size") ? parseInt(query.get("size") as string) : 10,
    code: query.get("code") ? (query.get("code") as string) : "",
  };

  const [filters, handleFiltersChange] = useFilters(initialFilters);

  useEffect(() => {
    const { page, size, code } = filters;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      code,
    });
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${queryParams.toString()}`
    );
  }, [filters]);

  const {
    data: flights,
    isLoading,
    startFetch,
  } = useFetch(
    {
      action: getFlights,
      initResult: [],
      autoFetch: true,
      body: filters,
      onError: (error) => {},
    },
    [filters]
  );

  const { startFetch: deleteFlight, isLoading: isDeletingFlight } = useFetch({
    action: deleteFlightAPI,
    onComplete: () => {
      startFetch(filters, false);
      setDeleteConfirmationModal({ id: "", isOpen: false });
    },
  });

  /**
   * Generates dropdown menu items for a flight record.
   * @param record - The flight record.
   * @returns An array of dropdown menu items.
   */
  const dropdownItems = (record: any): MenuProps["items"] => {
    return [
      {
        key: "edit",
        icon: <PencilSimple />,
        label: "Edit",
        disabled: record?.status === "processing",
        onClick: () => {
          setFlightModal({ isOpen: true, flight: record });
        },
      },
      {
        key: "delete",
        icon: <TrashSimple />,
        danger: true,
        label: "Delete",
        onClick: () =>
          setDeleteConfirmationModal({ id: record.id, isOpen: true }),
      },
    ];
  };

  const columns: TableColumn<any>[] = [
    { title: "Code", dataIndex: "code" },
    { title: "Capacity", dataIndex: "capacity" },
    { title: "Departure Date", dataIndex: "departureDate" },
    {
      title: "Image",
      dataIndex: "img",
      tableClassName: "tw-w-20 tw-whitespace-nowrap",
      render: ({ value, record }) =>
        record?.status === "processing" ? (
          <div className="tw-flex tw-items-center tw-gap-2">
            <Spinner className="tw-animate-spin" /> Processing ...
          </div>
        ) : value ? (
          <Button
            onClick={() => {
              setImagePreviewModal({ id: record.id, isOpen: true });
            }}
            title="View Image"
            type="default"
            icon={<Eye size={20} />}
          />
        ) : null,
    },
    {
      title: "Actions",
      dataIndex: "",
      tableClassName: "tw-w-10 tw-whitespace-nowrap",
      render: ({ record }) => {
        return (
          <Dropdown trigger={["click"]} menu={{ items: dropdownItems(record) }}>
            <Button
              type="default"
              icon={<DotsThreeVertical size={20} weight="bold" />}
            />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <PageContainer title="Flights">
      <div className="tw-flex tw-gap-4 tw-items-center">
        <SearchInput
          placeholder="Search by code..."
          initialValue={filters.code}
          onChange={(val) => {
            if (val !== filters.code) {
              handleFiltersChange("code", val, { action: "clear" });
            }
          }}
        />
        <Button
          onClick={() => setFlightModal({ isOpen: true, flight: null })}
          type="primary"
        >
          Create Flight
        </Button>
      </div>
      <CustomTable
        loading={isLoading}
        rowKey="id"
        columns={columns}
        data={flights?.resources || []}
      />
      <div className="tw-flex tw-justify-end tw-gap-4">
        <Select
          value={filters.size}
          onChange={(val) =>
            handleFiltersChange("size", val, {
              action: "clear",
            })
          }
          options={[
            {
              value: 5,
              label: "5",
            },
            {
              value: 10,
              label: "10",
            },
            {
              value: 20,
              label: "20",
            },
          ]}
        />
        <Pagination
          pageSize={filters.size}
          current={filters.page}
          total={flights?.count || 0}
          onChange={(page) => {
            handleFiltersChange("page", page);
          }}
        />
      </div>
      {flightModal.isOpen && (
        <FlightModal
          onFinished={() => {
            startFetch();
          }}
          flight={flightModal.flight}
          open={flightModal.isOpen}
          toggle={(val) => setFlightModal({ isOpen: val, flight: null })}
        />
      )}
      <Modal
        open={deleteConfirmationModal.isOpen}
        title="Delete Flight"
        okType="danger"
        okText="Delete"
        okButtonProps={{
          loading: isDeletingFlight,
          disabled: isDeletingFlight,
        }}
        onOk={() => deleteFlight({ id: deleteConfirmationModal.id })}
        onCancel={() => setDeleteConfirmationModal({ id: "", isOpen: false })}
      >
        <p>Are you sure you want to delete this flight?</p>
      </Modal>
      {imagePreviewModal.isOpen && (
        <ImagePreviewModal
          id={imagePreviewModal.id}
          open={imagePreviewModal.isOpen}
          toggle={(val) => setImagePreviewModal({ id: "", isOpen: val })}
        />
      )}
    </PageContainer>
  );
}

export default HomePage;
