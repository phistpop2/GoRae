


public class Filters {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		if( args.length > 0 ){
			Filter filter = new Filter();
			JSONArray array = filter.filtering( new JSONArray(args[0]) );
			JSONObject result = new JSONObject();
			result.put("result", array.toString() );
			
			System.out.println( result.toString() );
		}else{
			System.out.println("class.Filter - Invalid Arguments");
		}
	}


}
