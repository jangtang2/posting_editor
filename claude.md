# 변경 내역

## 2025-10-29: 공고 타이틀 폰트 컬러 블랙으로 변경

### 변경 사항
공고 타이틀의 폰트 컬러를 흰색(#ffffff)에서 검정색(#000000)으로 변경했습니다.

### 수정된 파일

#### 1. [src/components/JobPostingForm.js](src/components/JobPostingForm.js)

**변경 위치:**
- **Line 224**: HTML 복사 함수 (`copyHtmlToClipboard`) - 타이틀 color 속성
  ```javascript
  // 변경 전: color: #ffffff !important;
  // 변경 후: color: #000000 !important;
  ```

- **Line 343**: 잡코리아용 HTML 복사 함수 (`copyJobKoreaHtml`) - 타이틀 color 속성
  ```javascript
  // 변경 전: color: #ffffff !important;
  // 변경 후: color: #000000 !important;
  ```

- **Line 568**: 미리보기 컴포넌트 - Tailwind 클래스
  ```javascript
  // 변경 전: className="absolute z-10 bottom-[22%] left-[8%] text-white"
  // 변경 후: className="absolute z-10 bottom-[22%] left-[8%] text-black"
  ```

#### 2. [src/components/copy.js](src/components/copy.js)

**변경 위치:**
- **Line 161**: HTML 복사 함수 - 타이틀 color 속성
  ```javascript
  // 변경 전: color: #ffffff !important;
  // 변경 후: color: #000000 !important;
  ```

- **Line 316**: 미리보기 컴포넌트 - Tailwind 클래스
  ```javascript
  // 변경 전: className="absolute z-10 bottom-[22%] left-[8%] text-white"
  // 변경 후: className="absolute z-10 bottom-[22%] left-[8%] text-black"
  ```

### 영향 범위
- 미리보기 화면에 표시되는 타이틀 색상
- 복사되는 HTML 코드의 타이틀 색상
- 잡코리아용 HTML 코드의 타이틀 색상

모든 경우에서 타이틀이 검정색으로 표시됩니다.
