export class TimeFormatUtil {


  public static getPublishedAt(publishedAt: string) {
    const todayInSeconds: any = new Date().getTime() / 1000;
    let dateInSeconds = new Date(publishedAt).getTime() / 1000;
    let diff = todayInSeconds - dateInSeconds;

    if (diff < (60 * 60 * 24)) {
      return 'Today';
    } else if (diff < (60 * 60 * 24 * 30)) {
      return Math.floor(diff / (60 * 60 * 24)) + ' days ago';
    } else if (diff < (60 * 60 * 24 * 365)) {
      let time = Math.floor(diff / (60 * 60 * 24 * 30));
      return  time === 1 ? 'a month ago' : time + ' months ago';
    } else {
      let time = Math.floor(diff / (60 * 60 * 24 * 365));
      return  time === 1 ? 'a year ago' : time+ ' years ago';
    }
  }

  public static durationFormat(input){
    var H = TimeFormatUtil.formatTimeUnit(input, 'H');
    var M = TimeFormatUtil.formatTimeUnit(input, 'M');
    var S = TimeFormatUtil.formatTimeUnit(input, 'S');

    if (H == "00") {
      H = "";
    } else {
      H += ":"
    }

    return H  + M + ':' + S ;
  }

  private static formatTimeUnit(input, unit){
    var index = input.indexOf(unit);
    var output = "00"
    if(index < 0){
      return output; // unit isn't in the input
    }

    if(isNaN(input.charAt(index-2))){
      return '0' + input.charAt(index-1);
    }else{
      return input.charAt(index-2) + input.charAt(index-1);
    }
  }
}
