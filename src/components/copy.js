import React, { useState, useRef, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { X } from "lucide-react";

const SimpleRichTextEditor = ({ value, onChange }) => {
  const defaultTable = `
  <table style="border-collapse: collapse; width: 100%;">
    <tbody>
      <tr>
        <td style="border: 1px solid #ccc; padding: 8px; background-color: #f9fafb; font-weight: bold;">모집부문</td>
        <td style="border: 1px solid #ccc; padding: 8px; background-color: #f9fafb; font-weight: bold;">구분</td>
        <td style="border: 1px solid #ccc; padding: 8px; background-color: #f9fafb; font-weight: bold;">상세요강</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ccc; padding: 8px" rowspan="3"></td>
        <td style="border: 1px solid #ccc; padding: 8px;">담당업무</td>
        <td style="border: 1px solid #ccc; padding: 8px;"></td>
      </tr>
      <tr>

        <td style="border: 1px solid #ccc; padding: 8px;">필수자격</td>
        <td style="border: 1px solid #ccc; padding: 8px;"></td>
      </tr>
      <tr>

        <td style="border: 1px solid #ccc; padding: 8px;">우대사항</td>
        <td style="border: 1px solid #ccc; padding: 8px;"></td>
      </tr>
    </tbody>
  </table>
`;

  useEffect(() => {
    if (!value) {
      onChange(defaultTable);
    }
  }, []);

  const editorConfiguration = {
    toolbar: [
      "heading",
      "|",
      "bold",
      "italic",
      "|",
      "numberedList",
      "bulletedList",
      "|",
      "insertTable",
      "|",
      "undo",
      "redo",
    ],
    table: {
      contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
    },
    language: "ko",
  };

  return (
    <div className="editor-wrapper">
      <CKEditor
        editor={ClassicEditor}
        config={editorConfiguration}
        data={value}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
      />
      <style>
        {`
          .editor-wrapper {
            display: flex;
            flex-direction: column;
          }
          .ck-editor__editable {
            min-height: 300px;
          }
          .ck.ck-editor__main > .ck-editor__editable {
            background-color: white;
          }
          .ck.ck-editor__main > .ck-editor__editable:focus {
            border-color: #2563eb;
          }
        `}
      </style>
    </div>
  );
};

const Preview = ({ title, description, benefits }) => {
  const previewRef = useRef(null);

  // 표에 스타일을 적용하는 함수
  const addTableStyles = (html) => {
    if (!html) return "";

    // figure 태그 스타일 추가
    let styledHtml = html.replace(
      /<figure class="table"/g,
      '<figure class="table" style="width: 80% !important; margin: 0 auto !important;"'
    );

    // 기존 테이블 스타일 적용
    styledHtml = styledHtml
      .replace(
        /<table/g,
        '<table style="border-collapse: collapse !important; border: 1px solid #e5e7eb !important; width: 100% !important; font-size: 100% !important; word-wrap: break-word !important; table-layout: auto !important;"'
      )
      .replace(
        /<td/g,
        '<td style="border: 1px solid #e5e7eb !important; padding: 8px !important;"'
      );

    // tbody의 첫 번째 tr 찾기
    styledHtml = styledHtml.replace(
      /<tbody>\s*<tr>/,
      '<tbody><tr style="background-color: #f9fafb !important; text-align: center">'
    );

    // HTML을 파싱하고 셀 스타일을 수정
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = styledHtml;

    // 모든 행을 순회
    const rows = tempDiv.querySelectorAll("tr");
    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      if (cells.length > 0) {
        // 첫 번째 열
        const firstCell = cells[0];
        firstCell.style.textAlign = "center";
        firstCell.style.whiteSpace = "nowrap";
        firstCell.style.width = "auto";

        // 두 번째 열 (있는 경우)
        if (cells.length > 1) {
          const secondCell = cells[1];
          secondCell.style.textAlign = "center";
          secondCell.style.whiteSpace = "nowrap";
          secondCell.style.width = "auto";
        }
      }
    });

    return tempDiv.innerHTML;
  };

  const copyHtmlToClipboard = () => {
    if (!previewRef.current) return;

    // HTML 변환 및 스타일 적용
    const htmlContent = `
  <div style="background-color: #ffffff !important; width: 100% !important; max-width: 100% !important; margin: 0 auto !important; font-family: system-ui, -apple-system, sans-serif !important;">
    <div style="position: relative !important; width: 100% !important;">
      <img src="https://i.imgur.com/PsqtcKD.png"
           alt=""
           style="width: 100% !important; height: auto !important; object-fit: contain !important; display: block !important; max-width: 100% !important;" />
      <h1 style="color: #ffffff !important; position: absolute !important; z-index: 5 !important; bottom: 22% !important; left: 8% !important; margin: 0 !important; font-size: calc(100% + 2vmin) !important;">
        ${title}
      </h1>
    </div>

    <img src="https://i.imgur.com/chMXi0P.jpeg"
         alt=""
         style="width: 100% !important; height: auto !important; object-fit: contain !important; display: block !important; max-width: 100% !important;" />

    <div style="width: 100% !important; margin-top: 2% !important; margin-bottom: 7% !important; display: flex !important; justify-content: center !important;">
      ${addTableStyles(description)}
    </div>

    <img src="https://i.imgur.com/KsijpzW.jpeg"
         alt=""
         style="width: 100% !important; height: auto !important; object-fit: contain !important; display: block !important; max-width: 100% !important; margin-bottom: 10% !important;" />

    <div style="width: 100% !important; background-color: #cf152d !important; padding-bottom: 10% !important;">
      <img src="https://i.imgur.com/hk6MS8M.jpeg"
           alt=""
           style="width: 100% !important; height: auto !important; object-fit: contain !important; display: block !important; max-width: 100% !important; margin-bottom: 2% !important;" />
      <div style="width: 90% !important; background-color: #ffffff !important; border-radius: 24px !important; margin: 0 auto !important; padding: 3% 0 !important;">
        ${Object.entries(benefits)
          .filter(([_, items]) => items.length > 0)
          .map(
            ([category, items], index, array) => `
            <div style="width: 100% !important; display: flex !important;">
              <div style="width: 12% !important; margin: auto 0 !important; margin-left: 6% !important;">
                <img src="${getCategoryIcon(category)}"
                     alt=""
                     style="width: 100% !important; height: auto !important; object-fit: contain !important; display: block !important; max-width: 60px !important;" />
              </div>
              <div style="width: 70% !important; margin-right: 6% !important; padding: 5% 0 !important;">
                <h3 style="margin: 0 !important;">
                  <p style="line-height: 1.8 !important; margin: 0 !important;">
                    <b>
                      <span style="font-size: 120% !important; margin-bottom: 5% !important;">
                        ${category}
                      </span>
                    </b>
                  </p>
                </h3>
                <p style="margin: 0 !important; font-size: 16px !important;">
                  ${items.join(", ")}
                </p>
              </div>
            </div>
            ${
              index < array.length - 1
                ? `<div style="width: 88% !important; height: 1px !important; background-color: #D1D5DB !important; margin: 0 auto !important;"></div>`
                : ""
            }
          `
          )
          .join("")}
      </div>
    </div>

    <img src="https://i.imgur.com/jZGEXLa.jpeg"
         alt=""
         style="width: 100% !important; height: auto !important; object-fit: contain !important; display: block !important; max-width: 100% !important; margin-top: 10% !important;" />

    <div style="width: 100% !important; margin-bottom: 6% !important;">
      <img src="https://i.imgur.com/7YIkYEc.jpeg"
           alt=""
           style="width: 100% !important; height: auto !important; object-fit: contain !important; display: block !important; max-width: 100% !important; margin-top: 5% !important;" />
      <div style="width: 100% !important; display: flex !important; justify-content: center !important; background-color: #ffffff !important;">
        ${getFooterLinks()
          .map(
            (link) => `
          <a href="${link.href}"
             style="width: 22% !important; margin: 1% 2% !important; cursor: pointer !important;"
             target="_blank"
             title="${link.title}">
            <img src="${link.imgSrc}"
                 alt=""
                 style="width: 100% !important; height: auto !important; object-fit: contain !important; display: block !important; max-width: 100% !important;" />
          </a>
        `
          )
          .join("")}
      </div>
    </div>

    <img src="https://i.imgur.com/eLoh8fZ.jpeg"
         alt=""
         style="width: 100% !important; height: auto !important; object-fit: contain !important; display: block !important; max-width: 100% !important;" />
  </div>
`.trim();

    // Fallback 복사 함수
    const fallbackCopyTextToClipboard = (text) => {
      const textArea = document.createElement("textarea");
      textArea.value = text;

      // 화면 밖으로 텍스트영역 이동
      textArea.style.position = "fixed";
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.width = "2em";
      textArea.style.height = "2em";
      textArea.style.padding = "0";
      textArea.style.border = "none";
      textArea.style.outline = "none";
      textArea.style.boxShadow = "none";
      textArea.style.background = "transparent";

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand("copy");
        alert("HTML이 클립보드에 복사되었습니다!");
      } catch (err) {
        console.error("클립보드 복사 실패:", err);
        alert("클립보드 복사에 실패했습니다.");
      }

      document.body.removeChild(textArea);
    };

    // 먼저 navigator.clipboard 시도
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(htmlContent)
        .then(() => {
          alert("HTML이 클립보드에 복사되었습니다!");
        })
        .catch((err) => {
          console.error("Clipboard API 실패, fallback 사용:", err);
          fallbackCopyTextToClipboard(htmlContent);
        });
    } else {
      // navigator.clipboard를 사용할 수 없는 경우 fallback 사용
      fallbackCopyTextToClipboard(htmlContent);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={copyHtmlToClipboard}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        HTML 복사하기
      </button>
      <div ref={previewRef} className="bg-white w-full">
        <div className="relative w-full">
          <img
            src="https://i.imgur.com/PsqtcKD.png"
            alt=""
            className="w-full h-auto"
            style={{ objectFit: "contain" }}
          />
          <h1 className="absolute z-10 bottom-[22%] left-[8%] text-white">
            <span style={{ fontSize: "calc(100% + 2vmin)" }}>{title}</span>
          </h1>
        </div>

        <img
          src="https://i.imgur.com/chMXi0P.jpeg"
          alt=""
          className="w-full h-auto"
          style={{ objectFit: "contain" }}
        />

        <div
          className="w-full mt-[2%] mb-[7%]"
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <div
            style={{ width: "100%" }}
            dangerouslySetInnerHTML={{ __html: addTableStyles(description) }}
          />
        </div>

        <img
          src="https://i.imgur.com/KsijpzW.jpeg"
          alt=""
          className="w-full h-auto mb-[10%]"
          style={{ objectFit: "contain" }}
        />

        <div className="w-full bg-[#cf152d] pb-[10%]">
          <img
            src="https://i.imgur.com/hk6MS8M.jpeg"
            alt=""
            className="w-full h-auto mb-[2%]"
            style={{ objectFit: "contain" }}
          />
          <div className="w-[90%] bg-white rounded-3xl mx-auto py-[3%]">
            {Object.entries(benefits).map(
              ([category, items], index) =>
                items.length > 0 && (
                  <React.Fragment key={category}>
                    <div className="w-full flex">
                      <div className="w-[12%] my-auto ml-[6%]">
                        <img
                          src={getCategoryIcon(category)}
                          alt=""
                          className="w-full h-auto max-w-[60px]"
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                      <div
                        className="w-[70%] mr-[6%] py-[5%]"
                        style={{ marginLeft: "20px" }}
                      >
                        <h3>
                          <p className="leading-[1.8]">
                            <b>
                              <span
                                className="mb-[5%]"
                                style={{ fontSize: "calc(100% + 1vmin)" }}
                              >
                                {category}
                              </span>
                            </b>
                          </p>
                        </h3>
                        <p className="text-base text-[120%]">
                          {items.join(", ")}
                        </p>
                      </div>
                    </div>
                    {index <
                      Object.entries(benefits).filter(
                        ([_, items]) => items.length > 0
                      ).length -
                        1 && (
                      <div className="w-[88%] h-px bg-gray-300 mx-auto" />
                    )}
                  </React.Fragment>
                )
            )}
          </div>
        </div>

        <img
          src="https://i.imgur.com/jZGEXLa.jpeg"
          alt=""
          className="w-full h-auto mt-[10%]"
          style={{ objectFit: "contain" }}
        />

        <div className="w-full mb-[6%]">
          <img
            src="https://i.imgur.com/7YIkYEc.jpeg"
            alt=""
            className="w-full h-auto mt-[5%]"
            style={{ objectFit: "contain" }}
          />
          <div className="w-full flex justify-center bg-white">
            {getFooterLinks().map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block w-[22%] mx-[2%] my-[1%]"
                target="_blank"
                title={link.title}
              >
                <div className="relative w-full pb-[100%]">
                  <img
                    src={link.imgSrc}
                    alt=""
                    className="absolute top-0 left-0 w-full h-full object-contain"
                  />
                </div>
              </a>
            ))}
          </div>
        </div>

        <img
          src="https://i.imgur.com/eLoh8fZ.jpeg"
          alt=""
          className="w-full h-auto"
          style={{ objectFit: "contain" }}
        />
      </div>
    </div>
  );
};

// 카테고리별 아이콘 URL을 반환하는 헬퍼 함수
const getCategoryIcon = (category) => {
  const icons = {
    "기본 복지": "https://i.imgur.com/w1N8ciu.jpeg",
    지원제도: "https://i.imgur.com/toTe870.jpeg",
    리프레시: "https://i.imgur.com/vuPqdSv.jpeg",
    "식사 및 간식": "https://i.imgur.com/l9p6Zba.jpeg",
    "숙소/여행": "https://i.imgur.com/cixmPpy.jpeg",
    "교육/행사": "https://i.imgur.com/L5vLXI7.jpeg",
    근무환경: "https://i.imgur.com/NMAvYTE.jpeg",
  };
  return icons[category];
};

// 기본 복리후생 데이터
const defaultBenefits = {
  "기본 복지": [
    "4대보험",
    "퇴직연금",
    "인센티브",
    "장기근속자 포상",
    "우수사원 포상",
    "격려금",
    "건강검진",
    "웰컴키트",
    "사원증",
  ],
  지원제도: [
    "전세 및 주택 구입자금 대출 지원",
    "명절/근로자의 날 선물",
    "연말 선물",
    "생일 선물",
    "각종 경조사 지원",
    "자사 제품 할인",
    "근무복 제공",
  ],
  리프레시: [
    "연차/반차",
    "여름 휴가",
    "경조 휴가",
    "리프레시 휴가",
    "육아휴직",
    "산전 후 휴가",
    "배우자 출산 휴가",
    "임산부 근로시간 단축",
  ],
  "식사 및 간식": ["점식/석식", "간식", "카페테리아", "커피머신 지원"],
  "숙소/여행": [
    "휴양지 숙소 무료 제공(양평, 고성)",
    "법인 콘도 이용",
    "제주 연수원 할인",
  ],
  "교육/행사": [
    "중간관리자교육",
    "우수사원시상",
    "워크샵",
    "신입사원교육(OJT)",
    "교육지원",
    "창립기념일 행사",
    "송년 행사",
    "수습만료 행사",
  ],
  근무환경: [
    "전용 사옥 & 주차장",
    "법인 차량",
    "국내외 학회/전시회 참석",
    "휴게실",
    "샤워실",
    "입고싶은 옷 & 기르고 싶은 머리 자유롭게 가능",
  ],
};
// 푸터 링크 정보를 반환하는 헬퍼 함수
const getFooterLinks = () => [
  {
    href: "https://www.rapigen-inc.com/main/?skin=sub1_1.html",
    title: "래피젠 기업소개 보러가기",
    imgSrc: "https://i.imgur.com/t9RNAOJ.jpeg",
  },
  {
    href: "https://www.rapigen-inc.com/modules/board/bd_list.html?id=news",
    title: "래피젠 회사소식 보러가기",
    imgSrc: "https://i.imgur.com/YZAbeLV.jpeg",
  },
  {
    href: "https://www.rapigen-inc.com/modules/board/bd_list.html?id=careers",
    title: "래피젠 채용공고 보러가기",
    imgSrc: "https://i.imgur.com/Y5rwoYn.jpeg",
  },
];

const JobPostingForm = () => {
  const [title, setTitle] = useState("제목을 입력하세요");
  const [description, setDescription] = useState("");
  const [benefits, setBenefits] = useState(() => {
    // localStorage에서 저장된 데이터 불러오기
    const savedBenefits = localStorage.getItem("jobPostingBenefits");
    return savedBenefits ? JSON.parse(savedBenefits) : defaultBenefits;
  });
  const [currentBenefit, setCurrentBenefit] = useState({
    category: "기본 복지",
    value: "",
  });

  // benefits가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem("jobPostingBenefits", JSON.stringify(benefits));
  }, [benefits]);

  const handleBenefitAdd = () => {
    if (currentBenefit.value.trim()) {
      setBenefits((prev) => ({
        ...prev,
        [currentBenefit.category]: [
          ...prev[currentBenefit.category],
          currentBenefit.value.trim(),
        ],
      }));
      setCurrentBenefit((prev) => ({ ...prev, value: "" }));
    }
  };

  const handleBenefitRemove = (category, index) => {
    setBenefits((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index),
    }));
  };

  // 카테고리의 모든 항목 초기화 함수
  const handleResetCategory = (category) => {
    setBenefits((prev) => ({
      ...prev,
      [category]: defaultBenefits[category],
    }));
  };

  return (
    <div className="flex gap-4">
      <div className="w-1/2 p-4 border rounded-lg">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">채용 제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            채용 부문 내용
          </label>
          <SimpleRichTextEditor value={description} onChange={setDescription} />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">복리후생</label>
          <div className="flex gap-2 mb-2">
            <select
              value={currentBenefit.category}
              onChange={(e) =>
                setCurrentBenefit((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
              className="p-2 border rounded"
            >
              {Object.keys(benefits).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={currentBenefit.value}
              onChange={(e) =>
                setCurrentBenefit((prev) => ({
                  ...prev,
                  value: e.target.value,
                }))
              }
              className="flex-1 p-2 border rounded"
              placeholder="복리후생 항목 입력"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleBenefitAdd();
                }
              }}
            />
            <button
              onClick={handleBenefitAdd}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              추가
            </button>
          </div>

          <div className="space-y-4">
            {Object.entries(benefits).map(([category, items]) => (
              <div key={category} className="border-b pb-2">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{category}</h3>
                  <button
                    onClick={() => handleResetCategory(category)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    기본값으로 초기화
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {items.map((item, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100"
                    >
                      {item}
                      <button
                        onClick={() => handleBenefitRemove(category, index)}
                        className="ml-2 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-1/2 p-4 border rounded-lg overflow-auto">
        <Preview title={title} description={description} benefits={benefits} />
      </div>
    </div>
  );
};

export default JobPostingForm;
