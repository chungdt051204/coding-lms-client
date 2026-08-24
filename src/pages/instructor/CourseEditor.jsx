import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { courseService } from "../../services/courseService";
import { lessonService } from "../../services/lessonService";
import { toast } from "react-toastify";
import { validateForm } from "../../../helper/validateForm";
import { useNavigate, useParams } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import ReactPlayer from "react-player";
import axios from "axios";
import { IoCloudUploadOutline } from "react-icons/io5";

const CourseEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = id ? true : false;
  const categories = useSelector((state) => state.categories.items);
  const levels = ["Cơ bản", "Trung bình", "Nâng cao"];
  const [courseInfo, setCourseInfo] = useState({
    courseName: "",
    description: "",
    category_id: "",
    level: "",
    image: null,
    thumbnail: null,
    price: "",
  });
  const [preview, setPreview] = useState({
    imagePreview: null,
    thumbnailPreview: null,
  });
  const [requirements, setRequirements] = useState([]);
  const [objectives, setObjectives] = useState([]);
  const [requirementContent, setRequirementContent] = useState("");
  const [objectiveContent, setObjectiveContent] = useState("");
  const [lessons, setLessons] = useState([
    { lessonName: "", videoUrl: "", duration: "", order: 0 },
  ]);
  const validateLessons =
    lessons.filter(
      (value) =>
        value.lessonName.trim() !== "" &&
        value.videoUrl.trim() !== "" &&
        value.duration !== ""
    ) || [];
  const [error, setError] = useState({
    errorCourseName: "",
    errorDescription: "",
    errorCategory: "",
    errorLevel: "",
    errorImage: "",
    errorThumbnail: "",
    errorRequirement: "",
    errorObjective: "",
    errorPrice: "",
  });
  const [errorLessons, setErrorLessons] = useState([
    {
      errorLessonName: "",
      errorVideoUrl: "",
      errorDuration: "",
    },
  ]);

  // const handlePreview = ({ e, setPreview }) => {
  //   const allowedTypes = ["jpg", "png", "jpeg"];
  //   const image = e.target.files[0];
  //   const type = image?.name?.split(".")[1];
  //   if (!allowedTypes.includes(type)) {
  //     setError((prev) => ({
  //       ...prev,
  //       errorFile: "Định dạng ảnh không hợp lệ!",
  //     }));
  //     return;
  //   } else {
  //     const previewUrl = URL.createObjectURL(image);
  //     setPreview(previewUrl);
  //     setError((prev) => ({ ...prev, errorFile: "" }));
  //   }
  // };
  const handleValidateFile = ({ e, errorField }) => {
    const allowedTypes = ["jpg", "png", "jpeg"];
    const image = e.target.files[0];
    const type = image?.name?.split(".")[1];
    if (!allowedTypes.includes(type)) {
      setError((prev) => ({
        ...prev,
        [errorField]: "Định dạng ảnh không hợp lệ!",
      }));
      return false;
    } else if (image?.size > 300000) {
      setError((prev) => ({
        ...prev,
        [errorField]: "Kích thước ảnh tối đa 300KB!",
      }));
      return false;
    }
    return true;
  };
  const handlePreview = ({ e, field, errorField }) => {
    const image = e.target.files[0];
    const previewUrl = URL.createObjectURL(image);
    setPreview((prev) => ({ ...prev, [field]: previewUrl }));
    setError((prev) => ({ ...prev, [errorField]: "" }));
  };

  // Hàm lấy ID video Youtube
  const getYouTubeId = (url) => {
    const parsedUrl = new URL(url);
    // youtu.be/VIDEO_ID
    if (parsedUrl.hostname.includes("youtu.be")) {
      return parsedUrl.pathname.slice(1);
    }
    // youtube.com/watch?v=VIDEO_ID
    if (parsedUrl.searchParams.get("v")) {
      return parsedUrl.searchParams.get("v");
    }
    // youtube.com/shorts/VIDEO_ID
    if (parsedUrl.pathname.includes("/shorts/")) {
      return parsedUrl.pathname.split("/shorts/")[1];
    }
    // youtube.com/embed/VIDEO_ID
    if (parsedUrl.pathname.includes("/embed/")) {
      return parsedUrl.pathname.split("/embed/")[1];
    }
    return null;
  };

  // Hàm đổi thời lượng thành đơn vị giây
  const durationToSecond = (duration) => {
    const hours = duration.match(/(\d+)H/)?.[1] || 0;
    const minutes = duration.match(/(\d+)M/)?.[1] || 0;
    const seconds = duration.match(/(\d+)S/)?.[1] || 0;
    return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
  };

  useEffect(() => {
    if (id) {
      const getCourseById = async () => {
        const result = await courseService.getCourseById({ courseId: id });
        console.log(result.data);
        setCourseInfo({
          courseName: result.data?.item?.course_name || "",
          description: result.data?.item?.description || "",
          category_id: result.data?.item?.category_id._id || "",
          level: result.data?.item?.level || "",
          image: result.data?.item?.image_url || null,
          thumbnail: result.data?.item?.thumbnail_url || null,
          price: result.data?.item?.price,
        });
        result.data?.item?.requirements?.forEach((value) => {
          setRequirements((prev) => [...prev, value]);
        });
        result.data?.item?.objectives?.forEach((value) => {
          setObjectives((prev) => [...prev, value]);
        });
      };
      getCourseById();
      const getLessonsByCourse = async () => {
        const result = await lessonService.getLessonsByCourse({ courseId: id });
        if (result.data?.length > 0) {
          const formattedLessons = result.data?.map((value) => {
            return {
              lessonId: value._id,
              lessonName: value.lesson_name,
              videoUrl: value.video_url,
              duration: value.duration,
              order: value.order,
            };
          });
          setLessons(formattedLessons);
        }
      };
      getLessonsByCourse();
    }
  }, [id]);

  // Hàm set thông tin khóa học
  const handleSetCourseInfo = ({ e, setCourseInfo, field }) => {
    const { value } = e.target;
    setCourseInfo((prev) => ({ ...prev, [field]: value }));
  };

  // Hàm thêm item (requirement, objective)
  const handleAddItem = ({ content, setContent, setArray, field }) => {
    if (!content) {
      if (field === "requirement")
        setError((prev) => ({
          ...prev,
          errorRequirement: "Vui lòng nhập đầy đủ thông tin!",
        }));
      else
        setError((prev) => ({
          ...prev,
          errorObjective: "Vui lòng nhập đầy đủ thông tin!",
        }));
      return;
    }
    setArray((prev) => [...prev, content]);
    setContent("");
  };

  // Hàm xóa item(requirement, objective)
  const handleDeleteItem = ({ index, array, setArray }) => {
    setArray(
      //Filter cũng giống map có value và index
      array.filter((_, i) => i !== index)
    );
  };

  // Hàm set dữ liệu bài học
  const handleSetLesson = ({ fieldName, index, e, array, setArray }) => {
    const { value } = e.target;
    const newArray = [...array];
    newArray[index][fieldName] = value;
    newArray[index]["order"] = index + 1;
    setArray(newArray);
  };

  // Hàm clear lỗi bài học
  const handleSetErrorLesson = ({ fieldName, index, array, setArray }) => {
    const newArray = [...array];
    newArray[index][fieldName] = "";
    setArray(newArray);
  };

  // Hàm xóa bài học(khi chưa thêm, khi đã tồn tại trong khóa học)
  const handleDeleteLesson = async ({ index }) => {
    if (!lessons[index].lessonId) {
      setLessons(lessons?.filter((_, i) => i !== index));
    } else {
      try {
        const result = await lessonService.deleteLesson({
          lessonId: lessons[index].lessonId,
        });
        if (lessons.length == 1)
          setLessons([{ lessonName: "", videoUrl: "", duration: "" }]);
        else
          setLessons(
            lessons?.filter(
              (value) => value.lessonId !== lessons[index].lessonId
            )
          );
        toast.success(result.message || "Xóa bài học thành công");
      } catch (error) {
        const status = error.status;
        const message = error.message;
        console.log(status, message);
      }
    }
  };

  // Hàm set lỗi khóa học
  const handleSetError = ({ setError, field }) => {
    setError((prev) => ({ ...prev, [field]: "" }));
  };

  // Hàm lưu (thêm, chỉnh sửa)
  const handleSave = async (e) => {
    e.preventDefault();
    const data = {
      courseName: courseInfo.courseName,
      description: courseInfo.description,
      category_id: courseInfo.category_id,
      level: courseInfo.level,
      requirements,
      objectives,
      image: courseInfo.image,
      thumbnail: courseInfo.thumbnail,
      price: courseInfo.price,
    };
    if (validateForm.validateCourseForm({ formData: data, isEdit, setError })) {
      let isAllLessonsValid = true;
      let newErrorLessons = [...errorLessons];
      lessons?.forEach((value, index) => {
        const { isValid, errorLesson } = validateForm.validateLessonForm({
          formData: value,
        });
        newErrorLessons[index] = errorLesson;
        if (!isValid) isAllLessonsValid = false;
      });
      setErrorLessons(newErrorLessons);
      console.log(isAllLessonsValid);
      if (isAllLessonsValid) {
        const formData = new FormData();
        formData.append("courseName", courseInfo.courseName);
        formData.append("description", courseInfo.description);
        formData.append("category_id", courseInfo.category_id);
        formData.append("level", courseInfo.level);
        formData.append("image", courseInfo.image);
        formData.append("thumbnail", courseInfo.thumbnail);
        requirements?.forEach((value) => {
          formData.append("requirements", value);
        });
        objectives?.forEach((value) => {
          formData.append("objectives", value);
        });
        formData.append("price", courseInfo.price);
        formData.append("lessons", JSON.stringify(validateLessons)); //Vì FormData không có object lồng nhau nên dùng JSON.stringify để biến mảng thành chuỗi
        if (isEdit) {
          try {
            const result = await courseService.updateCourse({
              courseId: id,
              data: formData,
            });
            toast.success(result.message || "Cập nhật thành công");
            navigate("/instructor/courses");
          } catch (error) {
            const status = error.status;
            const message = error.data.message;
            console.log(status, message);
          }
        } else {
          try {
            console.log(courseInfo.category_id);
            const result = await courseService.addCourse({ data: formData });
            toast.success(result.message || "Tạo khóa học thành công");
            navigate("/instructor/courses");
          } catch (error) {
            const status = error.status;
            const message = error.data.message;
            if (status === 409)
              setError((prev) => ({ ...prev, errorCourseName: message }));
            console.log(message);
          }
        }
      }
    }
  };

  return (
    <>
      <div className="py-8">
        <div className="flex flex-col gap-y-1">
          <p className="text-display-sm text-surface-nav font-bold">
            {id ? "Chỉnh sửa khóa học" : "Tạo khóa học mới"}
          </p>
          <p className="text-title-lg text-nav-muted">
            {id
              ? "Chỉnh sửa thông tin khóa học của bạn"
              : "Điền thông tin khóa học của bạn"}
          </p>
        </div>
        <form className="mt-5" onSubmit={handleSave}>
          {/* Thông tin cơ bản */}
          <div className="flex flex-col gap-y-5 border-1 border-surface-bg rounded-[16px] p-5">
            <p className="text-title-lg text-surface-nav font-medium">
              Thông tin cơ bản
            </p>
            <div className="flex flex-col gap-y-2">
              <label
                className="text-surface-nav text-body-lg font-medium"
                htmlFor="courseName"
              >
                Tên khóa học *
              </label>
              <input
                className="p-2 bg-surface-bg rounded-[8px]"
                value={courseInfo.courseName}
                onChange={(e) => {
                  handleSetCourseInfo({
                    e,
                    setCourseInfo,
                    field: "courseName",
                  });
                  handleSetError({ setError, field: "errorCourseName" });
                }}
                type="text"
                placeholder="React cơ bản và nâng cao"
              />
              {error.errorCourseName && (
                <span className="text-body-md text-red-500">
                  {error.errorCourseName}
                </span>
              )}
              <label
                className="text-surface-nav text-body-lg font-medium"
                htmlFor="description"
              >
                Mô tả *
              </label>
              <textarea
                rows={5}
                className="p-2 bg-surface-bg rounded-[8px]"
                value={courseInfo.description}
                onChange={(e) => {
                  handleSetCourseInfo({
                    e,
                    setCourseInfo,
                    field: "description",
                  });
                  setError((prev) => ({ ...prev, errorDescription: "" }));
                }}
                type="text"
                placeholder="Mô tả chi tiết về khóa học..."
              />
              {error.errorDescription && (
                <span className="text-body-md text-red-500">
                  {error.errorDescription}
                </span>
              )}
              <div className="flex justify-between w-[35%]">
                <div className="flex flex-col gap-y-1">
                  <label
                    className="text-surface-nav text-body-lg font-medium"
                    htmlFor="category"
                  >
                    Danh mục *
                  </label>
                  <div className="flex flex-col gap-y-1">
                    <select
                      className="p-2 bg-surface-white border-1 border-surface-bg rounded-[8px] text-nav-muted outline-none"
                      value={courseInfo.category_id}
                      onChange={(e) => {
                        handleSetCourseInfo({
                          e,
                          setCourseInfo,
                          field: "category_id",
                        });
                        handleSetError({ setError, field: "errorCategory" });
                      }}
                    >
                      <option value="">Chọn danh mục</option>
                      {categories?.map((value) => {
                        return (
                          <option
                            key={value?.item?._id}
                            value={value?.item?._id}
                          >
                            {value?.item?.category_name}
                          </option>
                        );
                      })}
                    </select>
                    <span className="text-body-md text-red-500">
                      {error.errorCategory}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-y-1">
                  <label
                    className="text-surface-nav text-body-lg font-medium"
                    htmlFor="level"
                  >
                    Cấp độ *
                  </label>
                  <div className="flex flex-col gap-y-1">
                    <select
                      className="p-2 bg-surface-white border-1 border-surface-bg rounded-[8px] text-nav-muted outline-none"
                      value={courseInfo.level}
                      onChange={(e) => {
                        handleSetCourseInfo({
                          e,
                          setCourseInfo,
                          field: "level",
                        });
                        handleSetError({ setError, field: "errorLevel" });
                      }}
                    >
                      <option value="">Chọn cấp độ</option>
                      {levels?.map((value, index) => {
                        return (
                          <option key={index} value={value}>
                            {value}
                          </option>
                        );
                      })}
                    </select>
                    <span className="text-body-md text-red-500">
                      {error.errorLevel}
                    </span>
                  </div>
                </div>
              </div>
              <label
                className="text-surface-nav text-body-lg font-medium"
                htmlFor="image"
              >
                Ảnh khóa học *
              </label>
              <div className="flex flex-col gap-y-2 w-[45%]">
                {preview.imagePreview || courseInfo.image ? (
                  <div className="relative">
                    <img
                      className="rounded-[16px] opacity-80 w-[150px]"
                      src={preview.imagePreview || courseInfo.image}
                      alt=""
                    />
                  </div>
                ) : (
                  <div className="border-2 border-gray-300 border-dashed p-4 rounded-[8px]">
                    <label htmlFor="imagePreview" className="text-body-md">
                      <div className="flex gap-x-2 items-center text-brand-blue">
                        <IoCloudUploadOutline />
                        <p>Nhấp để chọn ảnh</p>
                      </div>
                      <p className="text-nav-muted">
                        Định dạng: JPG, PNG, JPEG
                      </p>
                    </label>
                    <input
                      onChange={(e) => {
                        if (
                          handleValidateFile({ e, errorField: "errorImage" })
                        ) {
                          setCourseInfo((prev) => ({
                            ...prev,
                            image: e.target.files[0],
                          }));
                          handlePreview({
                            e,
                            field: "imagePreview",
                            errorField: "errorImage",
                          });
                        }
                      }}
                      id="imagePreview"
                      type="file"
                      className="hidden"
                    />
                  </div>
                )}
                <span className="text-body-md text-red-500 font-medium">
                  {error.errorImage}
                </span>
              </div>
              <label
                className="text-surface-nav text-body-lg font-medium"
                htmlFor="thumbnail"
              >
                Ảnh bìa *
              </label>
              <div className="flex flex-col gap-y-2 w-[45%]">
                {preview.thumbnailPreview || courseInfo.thumbnail ? (
                  <div className="relative">
                    <img
                      className="rounded-[16px] opacity-80 w-[200px]"
                      src={preview.thumbnailPreview || courseInfo.thumbnail}
                      alt=""
                    />
                  </div>
                ) : (
                  <div className="border-2 border-gray-300 border-dashed p-4 rounded-[8px]">
                    <label htmlFor="thumbnailPreview" className="text-body-md">
                      <div className="flex gap-x-2 items-center text-brand-blue">
                        <IoCloudUploadOutline />
                        <p>Nhấp để chọn ảnh</p>
                      </div>
                      <p className="text-nav-muted">
                        Định dạng: JPG, PNG, JPEG
                      </p>
                    </label>
                    <input
                      onChange={(e) => {
                        if (
                          handleValidateFile({
                            e,
                            errorField: "errorThumbnail",
                          })
                        ) {
                          setCourseInfo((prev) => ({
                            ...prev,
                            thumbnail: e.target.files[0],
                          }));
                          handlePreview({
                            e,
                            field: "thumbnailPreview",
                            errorField: "errorThumbnail",
                          });
                        }
                      }}
                      id="thumbnailPreview"
                      type="file"
                      className="hidden"
                    />
                  </div>
                )}
                <span className="text-body-md text-red-500 font-medium">
                  {error.errorThumbnail}
                </span>
              </div>
            </div>
          </div>
          {/* Yêu cầu & kết quả đạt được */}
          <div className="flex flex-col justify-between gap-y-3 mt-6 border border-surface-bg rounded-[16px] p-4">
            <p className="text-title-lg text-surface-nav font-medium">
              Yêu cầu & Kết quả đạt được
            </p>
            <div className="flex flex-col gap-y-2">
              <div className="flex flex-col gap-y-1">
                <p className="text-surface-nav text-body-lg font-medium">
                  Yêu cầu trước khi học
                </p>
                <p className="text-nav-muted text-body-lg">
                  Những kỹ năng cần có trước khi tham gia khóa học
                </p>
                <div className="flex justify-between">
                  <input
                    className="p-2 w-[88%] bg-surface-bg rounded-[8px]"
                    value={requirementContent}
                    onChange={(e) => {
                      setRequirementContent(e.target.value);
                      setError((prev) => ({ ...prev, errorRequirement: "" }));
                    }}
                    type="text"
                    placeholder="Ví dụ: Hiểu biết cơ bản về HTML, CSS"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleAddItem({
                        content: requirementContent,
                        setContent: setRequirementContent,
                        setArray: setRequirements,
                        field: "requirement",
                      })
                    }
                    className="flex items-center gap-x-2 px-4 py-2 rounded-[8px] bg-surface-nav text-body-lg text-surface-white transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer"
                  >
                    <FaPlus />
                    Thêm
                  </button>
                </div>
                {error.errorRequirement && (
                  <span className="text-body-md text-red-500">
                    {error.errorRequirement}
                  </span>
                )}
                <ul>
                  {requirements.length > 0 ? (
                    requirements.map((value, index) => {
                      return (
                        <li className="flex justify-between mt-2" key={index}>
                          <div className="w-[92%] p-2 bg-gray-100 rounded-[8px]">
                            <p>{value}</p>
                          </div>
                          <button
                            onClick={() =>
                              handleDeleteItem({
                                index,
                                array: requirements,
                                setArray: setRequirements,
                              })
                            }
                            className="px-4 py-2 rounded-[8px] bg-surface-nav text-body-lg text-surface-white transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer"
                            type="button"
                          >
                            Xóa
                          </button>
                        </li>
                      );
                    })
                  ) : (
                    <p className="italic text-body-lg text-nav-muted">
                      Chưa có yêu cầu nào
                    </p>
                  )}
                </ul>
              </div>
              <div className="flex flex-col gap-y-1">
                <p className="text-surface-nav text-body-lg font-medium">
                  Kết quả đạt được sau khóa học
                </p>
                <p className="text-nav-muted text-body-lg">
                  Những kỹ năng hoặc kiến thức mà học viên sẽ có được sau khi
                  hoàn thành khóa học
                </p>
                <div className="flex justify-between">
                  <input
                    className="p-2 w-[88%] bg-surface-bg rounded-[8px]"
                    value={objectiveContent}
                    onChange={(e) => {
                      setObjectiveContent(e.target.value);
                      setError((prev) => ({ ...prev, errorObjective: "" }));
                    }}
                    type="text"
                    placeholder="Ví dụ: Xây dựng được ứng dụng web hoàn chỉnh với React"
                  />
                  <button
                    onClick={() =>
                      handleAddItem({
                        content: objectiveContent,
                        setContent: setObjectiveContent,
                        setArray: setObjectives,
                        field: "objective",
                      })
                    }
                    className="flex items-center gap-x-2 px-4 py-2 rounded-[8px] bg-surface-nav text-body-lg text-surface-white transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer"
                    type="button"
                  >
                    <FaPlus />
                    Thêm
                  </button>
                </div>
                {error.errorObjective && (
                  <span className="text-body-md text-red-500">
                    {error.errorObjective}
                  </span>
                )}
                <ul>
                  {objectives.length > 0 ? (
                    objectives.map((value, index) => {
                      return (
                        <li className="flex justify-between mt-2" key={index}>
                          <div className="w-[92%] p-2 bg-gray-100 rounded-[8px]">
                            <p>{value}</p>
                          </div>
                          <button
                            onClick={() =>
                              handleDeleteItem({
                                index,
                                array: objectives,
                                setArray: setObjectives,
                              })
                            }
                            className="px-4 py-2 rounded-[8px] bg-surface-nav text-body-lg text-surface-white transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer"
                            type="button"
                          >
                            Xóa
                          </button>
                        </li>
                      );
                    })
                  ) : (
                    <p className="italic text-body-lg text-nav-muted">
                      Chưa có kết quả đạt được nào
                    </p>
                  )}
                </ul>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-y-6 border border-surface-bg rounded-[16px] mt-6 p-4">
            <p className="text-title-lg text-surface-nav font-medium">
              Nội dung khóa học
            </p>
            <div className="flex flex-col gap-y-4">
              {lessons?.map((value, index) => {
                return (
                  <div
                    key={index}
                    className="flex flex-col gap-y-4 border border-surface-bg rounded-[16px] py-4 ps-4 pe-8"
                  >
                    <div className="flex justify-between">
                      <p className="text-title-lg text-surface-nav font-medium">
                        Bài học {index + 1}
                      </p>
                      {(lessons?.length > 1 || lessons[0].lessonId) && (
                        <button
                          type="button"
                          onClick={() => handleDeleteLesson({ index })}
                          className="text-body-lg text-surface-nav font-medium"
                        >
                          X
                        </button>
                      )}
                    </div>
                    <div className="flex flex-col gap-y-1">
                      <label
                        className="text-surface-nav text-body-lg font-medium"
                        htmlFor="lessonName"
                      >
                        Tiêu đề bài học *
                      </label>
                      <input
                        className="p-2 bg-surface-bg rounded-[8px] w-full"
                        value={value.lessonName}
                        onChange={(e) => {
                          handleSetLesson({
                            fieldName: "lessonName",
                            index,
                            e,
                            array: lessons,
                            setArray: setLessons,
                          });
                          handleSetErrorLesson({
                            fieldName: "errorLessonName",
                            index,
                            array: errorLessons,
                            setArray: setErrorLessons,
                          });
                        }}
                        type="text"
                        placeholder="Giới thiệu về React"
                      />
                      <span className="text-body-md text-red-500">
                        {errorLessons[index]?.errorLessonName}
                      </span>
                      <label
                        className="text-surface-nav text-body-lg font-medium"
                        htmlFor="videoUrl"
                      >
                        Link video
                      </label>
                      <input
                        className="p-2 bg-surface-bg rounded-[8px] w-full"
                        value={value.videoUrl}
                        onChange={async (e) => {
                          handleSetLesson({
                            fieldName: "videoUrl",
                            index,
                            e,
                            array: lessons,
                            setArray: setLessons,
                          });
                          const videoUrl = lessons[index].videoUrl;
                          if (!videoUrl.includes("https://www.youtube.com/")) {
                            const newErrors = [...errorLessons];
                            newErrors[index].errorVideoUrl =
                              "Đường dẫn video không hợp lệ!";
                            return;
                          }
                          const id = getYouTubeId(videoUrl);
                          try {
                            const result = await axios.get(
                              `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${id}&key=${
                                import.meta.env.VITE_API_KEY_YOUTUBE
                              }`
                            );
                            const duration =
                              result?.data?.items[0]?.contentDetails?.duration;
                            const second = durationToSecond(duration);
                            const newArray = [...lessons];
                            newArray[index].duration = second;
                            setLessons(newArray);
                            handleSetErrorLesson({
                              fieldName: "errorVideoUrl",
                              index,
                              array: errorLessons,
                              setArray: setErrorLessons,
                            });
                            handleSetErrorLesson({
                              fieldName: "errorDuration",
                              index,
                              array: errorLessons,
                              setArray: setErrorLessons,
                            });
                          } catch (error) {
                            const status = error.status;
                            const message = error.message;
                            console.log(status, message);
                          }
                        }}
                        type="text"
                        placeholder="https://www.youtube.com/watch?v=GQ-toR8F7rc"
                      />
                      <span className="text-body-md text-red-500">
                        {errorLessons[index]?.errorVideoUrl}
                      </span>
                      {value.videoUrl &&
                        value.videoUrl.includes("https://www.youtube.com/") && (
                          <ReactPlayer src={value.videoUrl} />
                        )}
                      <label
                        className="text-surface-nav text-body-lg font-medium"
                        htmlFor="duration"
                      >
                        Thời lượng
                      </label>
                      <input
                        className="p-2 bg-surface-bg rounded-[8px] w-full"
                        value={value.duration}
                        type="text"
                        disabled
                        placeholder="Thời lượng hiển thị tự động sau khi điền link video hợp lệ"
                      />
                      <span className="text-body-md text-red-500">
                        {errorLessons[index]?.errorDuration}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setLessons((prev) => [
                    ...prev,
                    { lessonName: "", videoUrl: "", duration: "", order: 0 },
                  ]);
                }}
                className="w-[18%] flex items-center gap-x-4 p-2  bg-surface-nav rounded-[8px] text-body-lg text-surface-white transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer"
              >
                <FaPlus />
                Thêm bài học
              </button>
            </div>
          </div>
          {/* Cài đặt */}
          <div className="border border-surface-bg rounded-[16px] p-4 mt-6">
            <p className="text-title-lg text-surface-nav font-medium">
              Cài đặt
            </p>
            <div className="flex flex-col justify-between gap-y-2 mt-4">
              <label
                className="text-surface-nav text-body-lg font-medium"
                htmlFor="price"
              >
                Giá(VNĐ) *
              </label>
              <input
                type="text"
                className="p-2 bg-surface-bg rounded-[8px] w-full"
                value={courseInfo.price}
                onChange={(e) => {
                  handleSetCourseInfo({ e, setCourseInfo, field: "price" });
                  handleSetError({ setError, field: "errorPrice" });
                }}
                placeholder="199000"
              />
              <span className="text-body-md text-red-500">
                {error.errorPrice}
              </span>
              <input
                className="bg-surface-nav text-surface-white  text-title-lg p-2 rounded-[8px] transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer"
                type="submit"
                value="Lưu"
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
export default CourseEditor;
