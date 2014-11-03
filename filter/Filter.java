public class Filter {
	public JSONArray filtering( JSONArray srcArray ){
        // input your code here

		for( int i = 0; i < srcArray.length(); i++ ){
			JSONObject location = srcArray.getJSONObject( i );
			// key : lat, lng
			location.put( "lat", location.getDouble( "lat") + 0.101 );
			location.put( "lng", location.getDouble( "lng") + 0.102 );

		}


		return srcArray;
	}
}
                                        