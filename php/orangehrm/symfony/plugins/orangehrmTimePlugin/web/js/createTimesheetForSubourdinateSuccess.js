$(document).ready(function(){

 

    dateTimeFormat= 'yyyy-MM-dd HH:mm';
    
    $("#createTimesheet").hide();
    
    var rDate = trim($(".date").val());
    if (rDate == '') {
        $(".date").val(dateDisplayFormat);
    }

    //Bind date picker
    daymarker.bindElement(".date",
    {
        onSelect: function(date){


            $(".date").trigger('change');
        },
        dateFormat:jsDateFormat
    });

    $('#DateBtn').click(function(){


        daymarker.show(".date");


    });
  
    $(".date").change(function() {
        $('#validationMsg').removeAttr('class');
        $('#validationMsg').html("");
        var startdate=$(".date").val();
   
        if(startdate.isValidDate()){
         
            var endDate= calculateEndDate(Date_toYMD()); 
        
            startDateArray=startdate.split('-');
            endDateArray=endDate.split('-');
            var startDate = new Date(startDateArray[0],startDateArray[1]-1,startDateArray[2]);
            var newEndDate= new Date(endDateArray[0],endDateArray[1]-1,endDateArray[2]);

           
            
            if (newEndDate < startDate)
            { 
                $('#validationMsg').attr('class', "messageBalloon_failure");
                $('#validationMsg').html("It is Not Possible to Create Future Timesheets");
            }else{
             
        
                url=createTimesheet+"?startDate="+startdate+"&employeeId="+employeeId
                $.getJSON(url, function(data) {
                
                    if(data[0]==1){
                        $('#validationMsg').attr('class', "messageBalloon_failure");
                        $('#validationMsg').html("Timesheet Overlaps with Existing Timesheets");
                    }
                    if(data[0]==3){
                        $('#validationMsg').attr('class', "messageBalloon_failure");
                        $('#validationMsg').html("Timesheet Already Exists"); 
                    }
                    if(data[0]==2){
                        startDate=data[1].split(' ');
                        $('form#createTimesheetForm').attr({
                            
                            //action:linkForViewTimesheet+"?state=SUBMITTED"+"&date="+date
                            action:linkForViewTimesheet+"?&timesheetStartDateFromDropDown="+startDate[0]+"&employeeId="+employeeId
                        });
                        $('form#createTimesheetForm').submit();
                    }
        
        
                })
            //            }
            //            else{
            //                $('#validationMsg').attr('class', "messageBalloon_failure");
            //                $('#validationMsg').html("Invalid Start date");
            //            }
            
        
                
            }
        }
        else{
            $('#validationMsg').attr('class', "messageBalloon_failure");
            $('#validationMsg').html("Invalid date");
        }
    });
    
    
    $("#btnAddTimesheet").click(function(){
        $("#createTimesheet").show();
    });
});


String.prototype.isValidDate = function() {
    var IsoDateRe = new RegExp("^([0-9]{4})-([0-9]{2})-([0-9]{2})$");
    var matches = IsoDateRe.exec(this);
    if (!matches) return false;
  

    var composedDate = new Date(matches[1], (matches[2] - 1), matches[3]);

    return ((composedDate.getMonth() == (matches[2] - 1)) &&
        (composedDate.getDate() == matches[3]) &&
        (composedDate.getFullYear() == matches[1]));

}

function calculateEndDate(startDate){

    var r = $.ajax({
        type: 'POST',
        url:  returnEndDate,
        data: "startDate="+startDate,
        async: false,

        success: function(msg){
           
            var array = msg.split(' ');
            date1 = array[0];
           
        }
        
    });
   
    return date1;
  

        
}


function Date_toYMD() {
    var dt=new Date();
    var year, month, day;
    year = String(dt.getFullYear());
    month = String(dt.getMonth() + 1);
    if (month.length == 1) {
        month = "0" + month;
    }
    day = String(dt.getDate());
    if (day.length == 1) {
        day = "0" + day;
    }
    return year + "-" + month + "-" + day;
}