import React, { useState, useRef, useEffect } from "react";
import { X, Camera, Download } from "lucide-react";
import html2canvas from "html2canvas";

const Preview = ({ title, description, benefits }) => {
  const previewRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);

  // 표에 스타일을 적용하는 함수
  const addTableStyles = (html) => {
    if (!html) return "";

    // figure 태그 스타일 추가
    let styledHtml = html.replace(
      /<figure class="table"/g,
      '<figure class="table" style="width: 80% !important; margin: 0 auto !important;"'
    );

    // 기존 테이블 스타일 적용 - 모든 셀에 기본적으로 word-break와 word-wrap 적용
    styledHtml = styledHtml
      .replace(
        /<table/g,
        '<table style="border-collapse: collapse !important; border: 1px solid #A59D84 !important; width: 100% !important; table-layout: fixed !important;"'
      )
      .replace(
        /<td/g,
        '<td style="border: 1px solid #e5e7eb !important; padding: 8px !important; text-align: center !important; word-break: keep-all !important; word-wrap: break-word !important; font-size: clamp(0.9rem, 1vw, 1rem) !important; line-height: clamp(1.25rem, 1.5vw, 1.5rem) !important;"'
      );

    // tbody의 첫 번째 tr 찾기 (헤더 행)
    styledHtml = styledHtml.replace(
      /<tbody>\s*<tr>/,
      '<tbody><tr style="background-color: #f9fafb !important; text-align: center !important;">'
    );

    // HTML을 파싱하고 셀 스타일을 수정
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = styledHtml;

    // 모든 행을 순회
    const rows = tempDiv.querySelectorAll("tr");
    rows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll("td");
      if (cells.length > 0) {
        // 첫 번째 열의 너비 설정 (모집부문)
        if (cells[0]) {
          cells[0].style.width = "25%";
        }

        // 두 번째 열의 너비 설정 (구분)
        if (cells[1]) {
          cells[1].style.width = "20%";
        }

        // 세 번째 열의 너비 설정 (상세요강)
        if (cells[2]) {
          cells[2].style.width = "55%";
        }

        // 첫 번째 행은 모든 셀이 가운데 정렬
        if (rowIndex === 0) {
          cells.forEach((cell) => {
            cell.style.textAlign = "center";
          });
        } else {
          // 첫 번째 행이 아닌 경우
          // 마지막 셀만 왼쪽 정렬, 나머지는 가운데 정렬
          cells.forEach((cell, cellIndex) => {
            if (cellIndex === cells.length - 1) {
              cell.style.textAlign = "left";
            } else {
              cell.style.textAlign = "center";
            }
          });
        }
      }
    });

    return tempDiv.innerHTML;
  };

  const copyHtmlToClipboard = () => {
    // HTML 템플릿 생성
    const htmlContent = `
  <div style="background-color: #ffffff !important; width: 100% !important; max-width: 100% !important; margin: 0 auto !important; font-family: system-ui, -apple-system, sans-serif !important;">
    <div style="position: relative !important; width: 100% !important;">
      <img src="https://gw.rapigen.com/editor/userfiles/rapigen.com/ysjang/7fd470c141768aece718997afc5d03da/ysjang_bd5bd5aa8c1610d771c79a1f13962cd.png"
           alt=""
           style="width: 100% !important; height: auto !important; object-fit: contain !important; display: block !important; max-width: 100% !important;" />
      <h1 style="color: #ffffff !important; position: absolute !important; z-index: 5 !important; bottom: 22% !important; left: 8% !important; margin: 0 !important;">
        <span style="font-size: calc(100% + 2.5vmin) !important;">${title}</span>
      </h1>
    </div>

    <img src="https://gw.rapigen.com/editor/userfiles/rapigen.com/ysjang/d311c1a92c894d387d18d7d681b297ae/ysjang_505b102fc405106b8f6b83264e22078.jpg"
         alt=""
         style="width: 100% !important; height: auto !important; object-fit: contain !important; display: block !important; max-width: 100% !important;" />

    <div style="width: 100% !important; height: fit-content !important; margin-top: 2% !important; margin-bottom: 7% !important; display: block !important; justify-content: center !important;">
      ${addTableStyles(description)}
    </div>

    <img src="https://gw.rapigen.com/editor/userfiles/rapigen.com/ysjang/260681e018726aeb38ddf3a04bb53be7/ysjang_7e45263c31c5df29b8010768df479c0.jpg"
         alt=""
         style="width: 100% !important; height: auto !important; object-fit: contain !important; display: block !important; max-width: 100% !important; margin-bottom: 10% !important;" />

    <div style="width: 100% !important; background-color: #cf152d !important; padding-bottom: 10% !important;">
      <img src="https://gw.rapigen.com/editor/userfiles/rapigen.com/ysjang/568a2af3af0a1c87807089dc6a681c6b/ysjang_150057b7d11fb9397e0fd22a88ecf7b.jpg"
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
              <div style="width: 70% !important; margin-right: 6% !important; padding: 5% 0 !important; margin-left: 20px !important;">
                <h3 style="margin: 0 !important;">
                  <p style="line-height: 1.8 !important; margin: 0 !important;">
                    <b>
                      <span style="font-size: calc(100% + 1vmin) !important; margin-bottom: 5% !important;">
                        ${category}
                      </span>
                    </b>
                  </p>
                </h3>
                <p style="margin: 0 !important; font-size: 16px !important; line-height: 20px !important; word-break: keep-all !important; word-wrap: break-word !important;">
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

    <img src="https://gw.rapigen.com/editor/userfiles/rapigen.com/ysjang/2f92048a74054d86229a54d43ff1edf4/ysjang_292034ce62a1bdb3cda65d01f4d7c69.jpg"
         alt=""
         style="width: 100% !important; height: auto !important; object-fit: contain !important; display: block !important; max-width: 100% !important; margin-top: 10% !important;" />

    <div style="width: 100% !important; margin-bottom: 6% !important;">
      <img src="https://gw.rapigen.com/editor/userfiles/rapigen.com/ysjang/6741eda181315f1cf66857c18cdccf24/ysjang_7aeb33ed65f9d764b977c525177e271.jpg"
           alt=""
           style="width: 100% !important; height: auto !important; object-fit: contain !important; display: block !important; max-width: 100% !important; margin-top: 5% !important;" />
      <div style="width: 100% !important; display: flex !important; justify-content: center !important; background-color: #ffffff !important;">
        ${getFooterLinks()
          .map(
            (link) => `
            <a href="${link.href}"
               style="display: block !important; width: 22% !important; margin: 1% 2% !important; cursor: pointer !important;"
               target="_blank"
               title="${link.title}">
              <div style="position: relative !important; width: 100% !important; padding-bottom: 100% !important;">
                <img src="${link.imgSrc}"
                     alt=""
                     style="position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; object-fit: contain !important;" />
              </div>
            </a>
          `
          )
          .join("")}
      </div>
    </div>

    <img src="https://gw.rapigen.com/editor/userfiles/rapigen.com/ysjang/53cdfda7630194cd1cb12dacffc7fad9/ysjang_db06d30522c45ed059a5a1ddf278b98.jpg"
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

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(htmlContent)
        .then(() => alert("HTML이 클립보드에 복사되었습니다!"))
        .catch((err) => {
          console.error("Clipboard API 실패, fallback 사용:", err);
          fallbackCopyTextToClipboard(htmlContent);
        });
    } else {
      fallbackCopyTextToClipboard(htmlContent);
    }
  };

  // 이미지로 저장하는 함수
  const saveAsImage = async () => {
    if (!previewRef.current) return;

    try {
      setIsCapturing(true);

      // 스크롤 위치 저장
      const scrollTop = previewRef.current.scrollTop;

      // 스크롤을 맨 위로 이동
      previewRef.current.scrollTop = 0;

      // 미리보기 요소의 스크롤 높이 가져오기
      const scrollHeight = previewRef.current.scrollHeight;
      const clientHeight = previewRef.current.clientHeight;

      // 캔버스 옵션 설정
      const options = {
        allowTaint: true,
        useCORS: true,
        scrollY: 0,
        height: scrollHeight,
        windowHeight: scrollHeight,
      };

      // html2canvas로 캡처
      const canvas = await html2canvas(previewRef.current, options);

      // 이미지로 변환
      const image = canvas.toDataURL("image/png");

      // 다운로드 링크 생성
      const link = document.createElement("a");
      link.href = image;
      link.download = `${title.replace(/\s+/g, "-")}-채용공고-${new Date()
        .toISOString()
        .slice(0, 10)}.png`;
      link.click();

      // 스크롤 위치 복원
      previewRef.current.scrollTop = scrollTop;
    } catch (error) {
      console.error("이미지 저장 중 오류 발생:", error);
      alert("이미지 저장 중 오류가 발생했습니다.");
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex gap-2">
        <button
          onClick={copyHtmlToClipboard}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <span>HTML 복사하기</span>
        </button>

        <button
          onClick={saveAsImage}
          disabled={isCapturing}
          className={`flex-1 px-4 py-2 rounded flex items-center justify-center gap-2 transition-colors ${
            isCapturing
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          {isCapturing ? (
            <span>저장 중...</span>
          ) : (
            <>
              <Camera size={18} />
              <span>이미지로 저장</span>
            </>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <div
          ref={previewRef}
          className="bg-white w-full h-full overflow-auto"
          style={{ scrollBehavior: isCapturing ? "auto" : "smooth" }}
        >
          <div className="relative w-full">
            <img
              src="https://gw.rapigen.com/editor/userfiles/rapigen.com/ysjang/7fd470c141768aece718997afc5d03da/ysjang_bd5bd5aa8c1610d771c79a1f13962cd.png"
              alt=""
              className="w-full h-auto"
              style={{ objectFit: "contain" }}
              crossOrigin="anonymous"
            />
            <h1 className="absolute z-10 bottom-[22%] left-[8%] text-white">
              <span style={{ fontSize: "calc(100% + 2vmin)" }}>{title}</span>
            </h1>
          </div>

          <img
            src="https://gw.rapigen.com/editor/userfiles/rapigen.com/ysjang/d311c1a92c894d387d18d7d681b297ae/ysjang_505b102fc405106b8f6b83264e22078.jpg"
            alt=""
            className="w-full h-auto"
            style={{ objectFit: "contain" }}
            crossOrigin="anonymous"
          />

          <div
            className="w-full mt-[2%] mb-[7%]"
            style={{
              width: "100%",
              display: "block",
              justifyContent: "center",
            }}
          >
            <div
              style={{ width: "100%" }}
              dangerouslySetInnerHTML={{ __html: addTableStyles(description) }}
            />
          </div>

          <img
            src="https://gw.rapigen.com/editor/userfiles/rapigen.com/ysjang/260681e018726aeb38ddf3a04bb53be7/ysjang_7e45263c31c5df29b8010768df479c0.jpg"
            alt=""
            className="w-full h-auto mb-[10%]"
            style={{ objectFit: "contain" }}
            crossOrigin="anonymous"
          />

          <div className="w-full bg-[#cf152d] pb-[10%]">
            <img
              src="https://gw.rapigen.com/editor/userfiles/rapigen.com/ysjang/568a2af3af0a1c87807089dc6a681c6b/ysjang_150057b7d11fb9397e0fd22a88ecf7b.jpg"
              alt=""
              className="w-full h-auto mb-[2%]"
              style={{ objectFit: "contain" }}
              crossOrigin="anonymous"
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
                            crossOrigin="anonymous"
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
                          <p
                            className="text-base"
                            style={{
                              fontSize: "16px",
                              lineHeight: "20px",
                              wordBreak: "keep-all",
                              wordWrap: "break-word",
                            }}
                          >
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
            src="https://gw.rapigen.com/editor/userfiles/rapigen.com/ysjang/2f92048a74054d86229a54d43ff1edf4/ysjang_292034ce62a1bdb3cda65d01f4d7c69.jpg"
            alt=""
            className="w-full h-auto mt-[10%]"
            style={{ objectFit: "contain" }}
            crossOrigin="anonymous"
          />

          <div className="w-full mb-[6%]">
            <img
              src="https://gw.rapigen.com/editor/userfiles/rapigen.com/ysjang/6741eda181315f1cf66857c18cdccf24/ysjang_7aeb33ed65f9d764b977c525177e271.jpg"
              alt=""
              className="w-full h-auto mt-[5%]"
              style={{ objectFit: "contain" }}
              crossOrigin="anonymous"
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
                      crossOrigin="anonymous"
                    />
                  </div>
                </a>
              ))}
            </div>
          </div>

          <img
            src="https://gw.rapigen.com/editor/userfiles/rapigen.com/ysjang/53cdfda7630194cd1cb12dacffc7fad9/ysjang_db06d30522c45ed059a5a1ddf278b98.jpg"
            alt=""
            className="w-full h-auto"
            style={{ objectFit: "contain" }}
            crossOrigin="anonymous"
          />
        </div>
      </div>
    </div>
  );
};

// 카테고리별 아이콘 URL을 반환하는 헬퍼 함수
const getCategoryIcon = (category) => {
  const icons = {
    "기본 복지":
      "https://gw.rapigen.com/editor/userfiles/rapigen.com/ysjang/9bc3bf7dfa93812f1494fdbe9628fbeb/ysjang_1d7d5b7e992648335bcfe55c0fa2a49.jpg",
    지원제도:
      "https://gw.rapigen.com/editor/userfiles/rapigen.com/ysjang/5b0bd4b6049cc793a76b54a1b78d86e4/ysjang_22bc14c4f56363436b8748cf01d75ca.jpg",
    리프레시:
      "https://gw.rapigen.com/editor/userfiles/rapigen.com/ysjang/8991c4392308ef36834537de471a595f/ysjang_ab2f6f80a6657ae17b1a7a18b26a640.jpg",
    "식사 및 간식":
      "https://gw.rapigen.com/editor/userfiles/rapigen.com/ysjang/372369272faf2c398f7eaa1f01e7bde1/ysjang_8e229e31aee1ebfc18e6fa99e2ebbbe.jpg",
    "숙소/여행":
      "https://gw.rapigen.com/editor/userfiles/rapigen.com/ysjang/363bec799a1f2ddfbac3b8fd91f70f5a/ysjang_346edad3d0b904fbf6145c31511f009.jpg",
    "교육/행사":
      "https://gw.rapigen.com/editor/userfiles/rapigen.com/ysjang/611f57bc34145d31759dce6022690427/ysjang_0889f99a530f2706e4c3e0dba0022ce.jpg",
    근무환경:
      "https://gw.rapigen.com/editor/userfiles/rapigen.com/ysjang/88dc0b12565ba6147081e4d15fa6da02/ysjang_b75ec5ec470ae62b8e0876ee88d3355.jpg",
  };
  return icons[category];
};

// 푸터 링크 정보를 반환하는 헬퍼 함수
const getFooterLinks = () => [
  {
    href: "https://www.rapigen.co.kr/main/?skin=sub1_1.html",
    title: "래피젠 기업소개 보러가기",
    imgSrc:
      "https://gw.rapigen.com/editor/userfiles/rapigen.com/ysjang/98b24b8185dd573bfc11828e806d929f/ysjang_0761ac10d6a91a086fbabdf9ea1d826.jpg",
  },
  {
    href: "https://www.rapigen.co.kr/modules/board/bd_list.html?id=news",
    title: "래피젠 회사소식 보러가기",
    imgSrc:
      "https://gw.rapigen.com/editor/userfiles/rapigen.com/ysjang/652ed7982a9c1040414fe5d083e09c13/ysjang_299079d95117c65a25996dd2f80098f.jpg",
  },
  {
    href: "https://www.rapigen.co.kr/modules/board/bd_list.html?id=careers",
    title: "래피젠 채용공고 보러가기",
    imgSrc:
      "https://gw.rapigen.com/editor/userfiles/rapigen.com/ysjang/810ccdb964d5af66fe5841b94278e743/ysjang_e9403a9f7ea8b8add57873c52b78632.jpg",
  },
];

export default Preview;
