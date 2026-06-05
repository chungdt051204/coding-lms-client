export const validateForm = {
  validateFormAuth: ({ fullName, email, password, setError }) => {
    // Reset các lỗi cũ trước khi check
    setError({ errorFullName: "", errorEmail: "", errorPassword: "" });
    let errors = {};
    const onlyAlphaRegex =
      /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = true;
    // Kiểm tra Họ tên (Chỉ check nếu có fullName )
    if (fullName !== undefined) {
      if (!fullName.trim()) {
        errors.errorFullName = "Họ tên không được bỏ trống!";
        isValid = false;
      } else if (fullName.trim().length < 3 || fullName.trim().length > 50) {
        errors.errorFullName = "Họ tên phải từ 3 đến 50 ký tự! ";
        isValid = false;
      } else if (!onlyAlphaRegex.test(fullName.trim())) {
        errors.errorFullName = "Họ tên không được chứa số hoặc ký tự đặc biệt!";
        isValid = false;
      }
    }
    // Kiểm tra Email
    if (!email) {
      errors.errorEmail = "Email không được bỏ trống!";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      errors.errorEmail = "Email không đúng định dạng!";
      isValid = false;
    }
    // Kiểm tra Password
    if (!password) {
      errors.errorPassword = "Mật khẩu không được bỏ trống!";
      isValid = false;
    } else if (password.length < 6) {
      errors.errorPassword = "Mật khẩu phải có tối thiểu 6 ký tự!";
      isValid = false;
    }
    // Cập nhật state lỗi và trả về kết quả
    if (!isValid) {
      setError((prev) => ({ ...prev, ...errors }));
    }
    return isValid;
  },

  validateFormCourse: ({ courseInfo, isEdit, setError }) => {
    setError({
      errorCourseName: "",
      errorDescription: "",
      errorCategory: "",
      errorLevel: "",
      errorFile: "",
      errorPrice: "",
    });
    let errors = {};
    const courseNameRegex = /^[\p{L}\p{N}\s&.+\-_()#/,"';:!?%*]+$/u;
    const onlyNumberRegex = /^[0-9]+$/;
    let isValid = true;
    //Kiểm tra tên khóa học
    if (!courseInfo.courseName.trim()) {
      errors.errorCourseName = "Tên khóa học không được bỏ trống!";
      isValid = false;
    } else if (
      courseInfo.courseName.trim().length < 3 ||
      courseInfo.courseName.trim().length > 50
    ) {
      errors.errorCourseName = "Tên khóa học phải từ 3 đến 50 ký tự!";
      isValid = false;
    } else if (!courseNameRegex.test(courseInfo.courseName)) {
      errors.errorCourseName =
        "Tên khóa học không được chứa ký tự không hợp lệ!";
      isValid = false;
    }
    //Kiểm tra danh mục
    if (!courseInfo.category_id) {
      errors.errorCategory = "Vui lòng chọn danh mục!";
      isValid = false;
    }
    //Kiểm tra cấp độ
    if (!courseInfo.level) {
      errors.errorLevel = "Vui lòng chọn cấp độ!";
      isValid = false;
    }
    if (!isEdit) {
      //Kiểm tra ảnh khóa học và ảnh bìa
      if (!courseInfo.image || !courseInfo.thumbnail) {
        errors.errorFile = "Vui lòng chọn ảnh!";
        isValid = false;
      } else if (
        courseInfo.image?.size > 300000 ||
        courseInfo.thumbnail?.size > 300000
      ) {
        errors.errorFile = "Kích thước ảnh tối đa 300KB!";
        isValid = false;
      }
    }
    //Kiểm tra giá
    if (!courseInfo.price) {
      errors.errorPrice = "Vui lòng nhập giá!";
      isValid = false;
    } else if (!onlyNumberRegex.test(courseInfo.price)) {
      errors.errorPrice = "Vui lòng nhập đúng định dạng giá!";
      isValid = false;
    }
    if (!isValid) setError((prev) => ({ ...prev, ...errors }));
    return isValid;
  },

  validateFormLesson: ({ lessonInfo }) => {
    let errorLesson = {
      errorLessonName: "",
      errorVideoUrl: "",
      errorDuration: "",
    };
    const lessonNameRegex = /^[\p{L}\p{N}\s&.+\-_()#/,"';:!?%*]+$/u;
    let isValid = true;
    //Kiểm tra nếu người dùng chưa nhập bất kỳ thông tin gì cho khóa học này thì bỏ qua không bắt lỗi
    if (!lessonInfo.lessonName && !lessonInfo.videoUrl && !lessonInfo.duration)
      return { isValid, errorLesson };
    else {
      //Kiểm tra tiêu đề bài học
      if (!lessonInfo.lessonName.trim().length) {
        errorLesson.errorLessonName = "Vui lòng nhập tiêu đề bài học!";
        isValid = false;
      } else if (
        lessonInfo.lessonName.trim().length < 3 ||
        lessonInfo.lessonName.trim().length > 255
      ) {
        errorLesson.errorLessonName =
          "Tiêu đề bài học phải từ 3 đến 255 ký tự!";
        isValid = false;
      } else if (!lessonNameRegex.test(lessonInfo.lessonName)) {
        errorLesson.errorLessonName =
          "Tiêu đề bài học không được chứa ký tự không hợp lệ!";
        isValid = false;
      }
      //Kiểm tra đường dẫn video
      if (!lessonInfo.videoUrl.trim()) {
        errorLesson.errorVideoUrl = "Vui lòng nhập đường dẫn video!";
        isValid = false;
      }
      //Kiểm tra thời lượng
      if (!lessonInfo.duration) {
        errorLesson.errorDuration = "Thời lượng không được bỏ trống!";
        isValid = false;
      }
    }
    return { isValid, errorLesson };
  },
};
