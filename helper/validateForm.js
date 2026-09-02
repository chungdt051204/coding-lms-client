export const validateForm = {
  validateUserForm: ({ formData, setError }) => {
    // Reset các lỗi cũ trước khi check
    setError({
      errorFullName: "",
      errorEmail: "",
      errorPassword: "",
      errorConfirmPassword: "",
      errorPhone: "",
      errorFile: "",
      errorLevel: "",
      errorExperience: "",
      errorAvatar: "",
      errorFrontIdCard: "",
      errorBackIdCard: "",
      errorDegreeCertificate: "",
    });
    let errors = {};
    const levels = ["Cử nhân", "Thạc sĩ", "Tiến sĩ"];
    const numberRegex = /^[0-9]+$/;
    const alphaRegex =
      /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/;
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const phoneRegex = /^\d{10}$/;
    const allowedTypes = ["jpg", "png", "jpeg"];
    let isValid = true;

    // Kiểm tra Họ tên (Nếu có)
    if (formData.fullName !== undefined) {
      if (!formData.fullName.trim()) {
        errors.errorFullName = "Họ tên không được bỏ trống!";
        isValid = false;
      } else if (
        formData.fullName.trim().length < 3 ||
        formData.fullName.trim().length > 50
      ) {
        errors.errorFullName = "Họ tên phải từ 3 đến 50 ký tự! ";
        isValid = false;
      } else if (!alphaRegex.test(formData.fullName.trim())) {
        errors.errorFullName = "Họ tên không được chứa số hoặc ký tự đặc biệt!";
        isValid = false;
      }
    }

    // Kiểm tra Email (Nếu có)
    if (formData.email !== undefined) {
      if (!formData.email) {
        errors.errorEmail = "Email không được bỏ trống!";
        isValid = false;
      } else if (!emailRegex.test(formData.email)) {
        errors.errorEmail = "Email không đúng định dạng!";
        isValid = false;
      }
    }

    // Kiểm tra Password (Nếu có)
    if (formData.password !== undefined) {
      if (!formData.password) {
        errors.errorPassword = "Mật khẩu không được bỏ trống!";
        isValid = false;
      } else if (formData.password.length < 6) {
        errors.errorPassword = "Mật khẩu phải có tối thiểu 6 ký tự!";
        isValid = false;
      }
    }

    // Kiểm tra confirmPassword (Nếu có)
    if (formData.confirmPassword !== undefined) {
      if (!formData.confirmPassword) {
        errors.errorConfirmPassword = "Mật khẩu xác nhận không được bỏ trống!";
        isValid = false;
      } else if (formData.confirmPassword != formData.password) {
        errors.errorConfirmPassword = "Mật khẩu không khớp!";
        isValid = false;
      }
    }

    //Kiểm tra số điện thoại (Nếu có)
    if (formData.phone !== undefined) {
      if (!formData.phone) {
        errors.errorPhone = "Số điện thoại không được bỏ trống!";
        isValid = false;
      } else if (!phoneRegex.test(formData.phone)) {
        errors.errorPhone = "Số điện thoại không hợp lệ!";
        isValid = false;
      }
    }

    //Kiểm tra ảnh đại diện (Nếu có)
    if (formData.avatar !== undefined) {
      const type = formData.avatar?.name?.split(".")[1];
      if (!formData.avatar) {
        errors.errorAvatar = "Vui lòng chọn ảnh!";
        isValid = false;
      } else if (!allowedTypes.includes(type)) {
        errors.errorAvatar = "Định dạng ảnh không hợp lệ!";
        isValid = false;
      } else if (formData.avatar?.size > 300000) {
        errors.errorAvatar = "Kích thước ảnh tối đa 300KB!";
        isValid = false;
      }
    }

    //Kiểm tra mặt trước cccd (Nếu có)
    if (formData.frontIdCard !== undefined) {
      const type = formData.frontIdCard?.name?.split(".")[1];
      if (!formData.frontIdCard) {
        errors.errorFrontIdCard = "Vui lòng chọn ảnh!";
        isValid = false;
      } else if (!allowedTypes.includes(type)) {
        errors.errorFrontIdCard = "Định dạng ảnh không hợp lệ!";
        isValid = false;
      } else if (formData.frontIdCard?.size > 300000) {
        errors.errorFrontIdCard = "Kích thước ảnh tối đa 300KB!";
        isValid = false;
      }
    }

    //Kiểm tra mặt sau cccd (Nếu có)
    if (formData.backIdCard !== undefined) {
      const type = formData.backIdCard?.name?.split(".")[1];
      if (!formData.backIdCard) {
        errors.errorBackIdCard = "Vui lòng chọn ảnh!";
        isValid = false;
      } else if (!allowedTypes.includes(type)) {
        errors.errorBackIdCard = "Định dạng ảnh không hợp lệ!";
        isValid = false;
      } else if (formData.backIdCard?.size > 300000) {
        errors.errorBackIdCard = "Kích thước ảnh tối đa 300KB!";
        isValid = false;
      }
    }

    //Kiểm tra bằng cấp (Nếu có)
    if (formData.degreeCertificate !== undefined) {
      const type = formData.degreeCertificate?.name?.split(".")[1];
      if (!formData.degreeCertificate) {
        errors.errorDegreeCertificate = "Vui lòng chọn ảnh!";
        isValid = false;
      } else if (!allowedTypes.includes(type)) {
        errors.errorDegreeCertificate = "Định dạng ảnh không hợp lệ!";
        isValid = false;
      } else if (formData.degreeCertificate?.size > 300000) {
        errors.errorDegreeCertificate = "Kích thước ảnh tối đa 300KB!";
        isValid = false;
      }
    }

    // Kiểm tra trình độ (Nếu có)
    if (formData.level !== undefined) {
      if (!formData.level) {
        errors.errorLevel = "Vui lòng chọn trình độ!";
        isValid = false;
      } else if (!levels?.includes(formData.level)) {
        errors.errorLevel = "Trình độ không hợp lệ!";
        isValid = false;
      }
    }

    //Kiểm tra kinh nghiệm giảng dạy (Nếu có)
    if (formData.experience !== undefined) {
      if (!formData.experience) {
        errors.errorExperience = "Kinh nghiệm giảng dạy không được để trống!";
        isValid = false;
      } else if (!numberRegex.test(formData.experience)) {
        errors.errorExperience = "Số năm không hợp lệ!";
        isValid = false;
      } else if (formData.experience < 1 || formData.experience > 20) {
        errors.errorExperience =
          "Chỉ chấp nhận các giảng viên từ 1 đến 20 năm kinh nghiệm!";
        isValid = false;
      }
    }

    // Cập nhật state lỗi và trả về kết quả
    if (!isValid) {
      setError((prev) => ({ ...prev, ...errors }));
    }
    return isValid;
  },
  validateCourseForm: ({ formData, isEdit, setError }) => {
    setError({
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
    let errors = {};
    const courseNameRegex = /^[\p{L}\p{N}\s&.+\-_()#/,"';:!?%*]+$/u;
    const numberRegex = /^[0-9]+$/;
    let isValid = true;

    //Kiểm tra tên khóa học
    if (!formData.courseName.trim()) {
      errors.errorCourseName = "Tên khóa học không được bỏ trống!";
      isValid = false;
    } else if (
      formData.courseName.trim().length < 3 ||
      formData.courseName.trim().length > 50
    ) {
      errors.errorCourseName = "Tên khóa học phải từ 3 đến 50 ký tự!";
      isValid = false;
    } else if (!courseNameRegex.test(formData.courseName)) {
      errors.errorCourseName =
        "Tên khóa học không được chứa ký tự không hợp lệ!";
      isValid = false;
    }

    //Kiểm tra mô tả
    if (!formData.description) {
      errors.errorDescription = "Mô tả không được bỏ trống!";
      isValid = false;
    }

    //Kiểm tra danh mục
    if (!formData.category_id) {
      errors.errorCategory = "Vui lòng chọn danh mục!";
      isValid = false;
    }

    //Kiểm tra cấp độ
    if (!formData.level) {
      errors.errorLevel = "Vui lòng chọn cấp độ!";
      isValid = false;
    }

    if (!isEdit) {
      //Kiểm tra ảnh khóa học và ảnh bìa
      if (formData.image == null) {
        errors.errorImage = "Vui lòng chọn ảnh!";
        isValid = false;
      } else if (formData.image?.size > 300000) {
        errors.errorImage = "Kích thước ảnh tối đa 300KB!";
        isValid = false;
      }
      if (formData.thumbnail == null) {
        errors.errorThumbnail = "Vui lòng chọn ảnh!";
        isValid = false;
      } else if (formData.thumbnail?.size > 300000) {
        errors.errorThumbnail = "Kích thước ảnh tối đa 300KB!";
        isValid = false;
      }
    }

    //Kiểm tra yêu cầu
    if (formData.requirements?.length == 0) {
      errors.errorRequirement = "Vui lòng thêm ít nhất 1 yêu cầu!";
      isValid = false;
    }

    //Kiểm tra kết quả đạt được
    if (formData.objectives?.length == 0) {
      errors.errorObjective = "Vui lòng thêm ít nhất 1 kết quả đạt được!";
      isValid = false;
    }

    //Kiểm tra giá
    if (formData.price == null) {
      errors.errorPrice = "Vui lòng nhập giá!";
      isValid = false;
    } else if (!numberRegex.test(formData.price)) {
      errors.errorPrice = "Vui lòng nhập đúng định dạng giá!";
      isValid = false;
    }

    if (!isValid) setError((prev) => ({ ...prev, ...errors }));
    return isValid;
  },

  validateLessonForm: ({ formData }) => {
    let errorLesson = {
      errorLessonName: "",
      errorVideoUrl: "",
      errorDuration: "",
    };
    const lessonNameRegex = /^[\p{L}\p{N}\s&.+\-_()#/,"';:!?%*]+$/u;
    let isValid = true;

    //Kiểm tra nếu người dùng chưa nhập bất kỳ thông tin gì cho bài học này thì bỏ qua không bắt lỗi
    if (!formData.lessonName && !formData.videoUrl && !formData.duration)
      return { isValid, errorLesson };
    else {
      //Kiểm tra tiêu đề bài học
      if (!formData.lessonName.trim().length) {
        errorLesson.errorLessonName = "Vui lòng nhập tiêu đề bài học!";
        isValid = false;
      } else if (
        formData.lessonName.trim().length < 3 ||
        formData.lessonName.trim().length > 255
      ) {
        errorLesson.errorLessonName =
          "Tiêu đề bài học phải từ 3 đến 255 ký tự!";
        isValid = false;
      } else if (!lessonNameRegex.test(formData.lessonName)) {
        errorLesson.errorLessonName =
          "Tiêu đề bài học không được chứa ký tự không hợp lệ!";
        isValid = false;
      }

      //Kiểm tra đường dẫn video
      if (!formData.videoUrl.trim()) {
        errorLesson.errorVideoUrl = "Vui lòng nhập đường dẫn video!";
        isValid = false;
      }

      //Kiểm tra thời lượng
      if (!formData.duration) {
        errorLesson.errorDuration = "Thời lượng không được bỏ trống!";
        isValid = false;
      }
    }
    return { isValid, errorLesson };
  },
};
