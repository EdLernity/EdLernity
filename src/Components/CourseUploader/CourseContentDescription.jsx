import React from "react";
import InputButton from "../Input/InputButton";

function CourseContentDescription({ questions, setQuestions, answers, setAnswers, addQuestion, removeQuestion, courseContentDescription, setCourseContentDescription }) {
  const handleQuestionChange = (e, index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = e.target.value;
    setQuestions(updatedQuestions);

    // Update courseContentDescription
    const updatedCourseContent = [...courseContentDescription];
    updatedCourseContent[index] = { ...updatedCourseContent[index], question: e.target.value };
    setCourseContentDescription(updatedCourseContent);
  };

  const handleAnswerChange = (e, index) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = e.target.value;
    setAnswers(updatedAnswers);

    // Update courseContentDescription
    const updatedCourseContent = [...courseContentDescription];
    updatedCourseContent[index] = { ...updatedCourseContent[index], answer: e.target.value };
    setCourseContentDescription(updatedCourseContent);
  };

  return (
    <div>
      {questions.map((question, index) => (
        <>
          <div key={index} className="mb-4">
            <InputButton
              type="text"
              id={`question${index + 1}`}
              label={`Question ${index + 1}`}
              fullWidth
              value={question}
              onChange={(e) => handleQuestionChange(e, index)}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div className="my-4">
            <InputButton
              type="text"
              id={`answer${index + 1}`}
              label="Answer"
              fullWidth
              value={answers[index]}
              onChange={(e) => handleAnswerChange(e, index)}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          {index === questions.length - 1 && (
            <button onClick={addQuestion} className="text-blue-500 hover:underline">
              Add Question
            </button>
          )}
          {index !== 0 && (
            <button onClick={() => removeQuestion(index)} className="text-red-500 hover:underline ml-2 mb-2">
              Remove Question
            </button>
          )}
        </>
      ))}
    </div>
  );
}

export default CourseContentDescription;
