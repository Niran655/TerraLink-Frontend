import { useMutation, useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";
import * as Yup from "yup";

import { CREATE_EMPLOYEE, UPDATE_EMPLOYEE } from "../../../graphql/mutation";
import { GET_DEPARTMENTS_WITH_PAGINATION } from "../../../graphql/queries";
import { useAuth } from "../../Context/AuthContext";
import ReusableForm from "../include/useForm";

const initialValues = {
  image: "",
  nameKh: "",
  nameEn: "",
  gender: "",
  phone: "",
  email: "",
  password: "",
  position: "",
  departmentId: "",
  hireDate: "",
  address: "",
  remark: "",
  active: true,
  
  employeeCode: "",
  employmentType: "Full-time",
  status: "Active",
  "emergencyContact.name": "",
  "emergencyContact.phone": "",
  "emergencyContact.relation": "",
  "bankAccount.bankName": "",
  "bankAccount.accountName": "",
  "bankAccount.accountNumber": "",
  "contractInfo.contractType": "",
  "contractInfo.startDate": "",
  "contractInfo.endDate": "",
  "contractInfo.basicSalary": 0
};

export default function EmployeeForm({ open, onClose, t, employeeData, dialogTitle, setRefetch }) {
  const { setAlert } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState(initialValues);
  const { data } = useQuery(GET_DEPARTMENTS_WITH_PAGINATION, {
    variables: { pagination: false, active: true },
  });

  useEffect(() => {
    if (employeeData) {
      setFormValues({
        ...initialValues,
        ...employeeData,
        departmentId: employeeData.department?._id || "",
        "emergencyContact.name": employeeData.emergencyContact?.name || "",
        "emergencyContact.phone": employeeData.emergencyContact?.phone || "",
        "emergencyContact.relation": employeeData.emergencyContact?.relation || "",
        "bankAccount.bankName": employeeData.bankAccount?.bankName || "",
        "bankAccount.accountName": employeeData.bankAccount?.accountName || "",
        "bankAccount.accountNumber": employeeData.bankAccount?.accountNumber || "",
        "contractInfo.contractType": employeeData.contractInfo?.contractType || "",
        "contractInfo.startDate": employeeData.contractInfo?.startDate ? new Date(employeeData.contractInfo.startDate).toISOString().split('T')[0] : "",
        "contractInfo.endDate": employeeData.contractInfo?.endDate ? new Date(employeeData.contractInfo.endDate).toISOString().split('T')[0] : "",
        "contractInfo.basicSalary": employeeData.contractInfo?.basicSalary || 0
      });
    } else {
      setFormValues(initialValues);
    }
  }, [employeeData]);

  const departmentOptions = (data?.getDepartmentsWithPagination?.data || []).map((department) => ({
    value: department._id,
    label: department.nameEn || department.nameKh,
  }));

  const [createEmployee] = useMutation(CREATE_EMPLOYEE, {
    onCompleted: ({ createEmployee }) => {
      setLoading(false);
      if (createEmployee?.isSuccess) {
        setAlert(true, "success", createEmployee.message);
        setRefetch();
        onClose();
      } else {
        setAlert(true, "error", createEmployee?.message);
      }
    },
    onError: (error) => {
      setLoading(false);
      setAlert(true, "error", error.message);
    },
  });

  const [updateEmployee] = useMutation(UPDATE_EMPLOYEE, {
    onCompleted: ({ updateEmployee }) => {
      setLoading(false);
      if (updateEmployee?.isSuccess) {
        setAlert(true, "success", updateEmployee.message);
        setRefetch();
        onClose();
      } else {
        setAlert(true, "error", updateEmployee?.message);
      }
    },
    onError: (error) => {
      setLoading(false);
      setAlert(true, "error", error.message);
    },
  });

  const handleSubmit = (values) => {
    setLoading(true);
    const input = {
      image: values.image,
      nameKh: values.nameKh,
      nameEn: values.nameEn,
      gender: values.gender,
      phone: values.phone,
      email: values.email,
      password: values.password || undefined,
      position: values.position,
      departmentId: values.departmentId || null,
      hireDate: values.hireDate,
      address: values.address,
      remark: values.remark,
      active: values.active,

      employeeCode: values.employeeCode || undefined,
      employmentType: values.employmentType,
      status: values.status,
      emergencyContact: {
        name: values["emergencyContact.name"],
        phone: values["emergencyContact.phone"],
        relation: values["emergencyContact.relation"]
      },
      bankAccount: {
        bankName: values["bankAccount.bankName"],
        accountName: values["bankAccount.accountName"],
        accountNumber: values["bankAccount.accountNumber"]
      },
      contractInfo: {
        contractType: values["contractInfo.contractType"],
        startDate: values["contractInfo.startDate"] || null,
        endDate: values["contractInfo.endDate"] || null,
        basicSalary: Number(values["contractInfo.basicSalary"] || 0)
      }
    };
    if (dialogTitle === "Create") {
      createEmployee({ variables: { input } });
    } else {
      updateEmployee({ variables: { id: employeeData._id, input } });
    }
  };

  return (
    <ReusableForm
      open={open}
      onClose={onClose}
      dialogTitle={dialogTitle === "Create" ? t("add_employee") : t("update_employee")}
      initialValues={formValues}
      validationSchema={Yup.object({
        nameKh: Yup.string().required(t("require")),
        nameEn: Yup.string().required(t("require")),
        email: Yup.string().email().required(t("require")),
        password: employeeData
          ? Yup.string().nullable()
          : Yup.string().required(t("require")),
      })}
      onSubmit={handleSubmit}
      loading={loading}
      t={t}
      tabs={[
        {
          title: "Basic Info",
          fields: [
            { name: "image", label: t("image"), type: "image", grid: { xs: 12 } },
            { name: "employeeCode", label: "Employee Code / ID", grid: { xs: 12, md: 6 } },
            { name: "nameKh", label: t("khmer_name"), grid: { xs: 12, md: 6 } },
            { name: "nameEn", label: t("english_name"), grid: { xs: 12, md: 6 } },
            {
              name: "gender",
              label: t("gender"),
              type: "select",
              options: [
                { value: "male", label: t("male") },
                { value: "female", label: t("female") },
                { value: "other", label: t("other") },
              ],
              grid: { xs: 12, md: 6 },
            },
            { name: "phone", label: t("phone"), grid: { xs: 12, md: 6 } },
            { name: "email", label: t("email"), grid: { xs: 12, md: 6 } },
            { name: "password", label: t("password"), type: "password", grid: { xs: 12, md: 6 } },
            { name: "position", label: t("position"), grid: { xs: 12, md: 6 } },
            {
              name: "departmentId",
              label: t("department"),
              type: "select",
              options: [{ value: "", label: t("all") }, ...departmentOptions],
              grid: { xs: 12, md: 6 },
            },
            { name: "hireDate", label: t("hire_date"), type: "date", grid: { xs: 12, md: 6 } },
            { name: "address", label: t("address"), rows: 2, grid: { xs: 12, md:6 } },
            { name: "remark", label: t("remark"), rows: 2, grid: { xs: 12, md:6 } },
            {
              name: "status",
              label: "Employee Status",
              type: "select",
              options: [
                { value: "Active", label: "Active" },
                { value: "Inactive", label: "Inactive" },
                { value: "Suspended", label: "Suspended" },
                { value: "Resigned", label: "Resigned" },
              ],
              grid: { xs: 12, md: 6 },
            },
            { name: "active", label: t("active"), type: "checkbox", grid: { xs: 12 } },
          ],
        },
        {
          title: "Emergency & Bank",
          fields: [
            { name: "emergencyContact.name", label: "Emergency Contact Name", grid: { xs: 12, md: 4 } },
            { name: "emergencyContact.phone", label: "Emergency Contact Phone", grid: { xs: 12, md: 4 } },
            { name: "emergencyContact.relation", label: "Emergency Contact Relation", grid: { xs: 12, md: 4 } },
            { name: "bankAccount.bankName", label: "Bank Name", grid: { xs: 12, md: 4 } },
            { name: "bankAccount.accountName", label: "Bank Account Name", grid: { xs: 12, md: 4 } },
            { name: "bankAccount.accountNumber", label: "Bank Account Number", grid: { xs: 12, md: 4 } },
          ],
        },
        {
          title: "Contract & Salary",
          fields: [
            {
              name: "employmentType",
              label: "Employment Type",
              type: "select",
              options: [
                { value: "Full-time", label: "Full-time" },
                { value: "Part-time", label: "Part-time" },
                { value: "Contract", label: "Contract" },
                { value: "Internship", label: "Internship" },
              ],
              grid: { xs: 12, md: 6 },
            },
            { name: "contractInfo.contractType", label: "Contract Type / Title", grid: { xs: 12, md: 6 } },
            { name: "contractInfo.startDate", label: "Contract Start Date", type: "date", grid: { xs: 12, md: 6 } },
            { name: "contractInfo.endDate", label: "Contract End Date", type: "date", grid: { xs: 12, md: 6 } },
            { name: "contractInfo.basicSalary", label: "Basic Contract Salary ($)", type: "number", grid: { xs: 12, md: 6 } },
          ],
        }
      ]}
    />
  );
}
