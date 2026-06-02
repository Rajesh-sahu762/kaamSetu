const ProgressBar = ({
  step,
  totalSteps,
  title,
}) => {
  const width = (step / totalSteps) * 100;

  return (
    <>


  <div className="max-w-3xl mx-auto mb-12">
          <div className="flex justify-between text-xs font-semibold mb-2">
                      Step {step} of {totalSteps}
            <span className="text-[#45474c]">
              <span>{title}</span>
            </span>
          </div>

          <div className="h-[3px] bg-[#d3e4fe] rounded-full overflow-hidden">
             <div
          style={{ width: `${width}%` }}
          className="h-full bg-[#091426]"
        />
          </div>
        </div>


      {/* <div className="flex justify-between mb-2">
        <span>
        </span>

        
      </div>

      <div className="h-[3px] bg-[#d3e4fe]">
      
      </div> */}
    </>
  );
};

export default ProgressBar;