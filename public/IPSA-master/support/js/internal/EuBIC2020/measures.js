extract_mz = function(prev, next){
	// maps [{"mz":v1, "intensity": v2}, ...]
	// to {"v1" : v2, ....}
	prev[next["mz"]] = next["intensity"]
	return(prev)
}


//let spectra_zipped = arr1.map((x, i) => [x, arr2[i]]);



z = function(intensity_bin){
	return {"intensity_1": intensity_bin in spectrum_1_simple?spectrum_1_simple[intensity_bin]:0,
		"intensity_2": intensity_bin in spectrum_2_simple?spectrum_2_simple[intensity_bin]:0}

}


f2 = function(obj){
	obj["1_m_1"] = obj["intensity_1"] * obj["intensity_1"]
	obj["2_m_2"] = obj["intensity_2"] * obj["intensity_2"]
	obj["1_m_2"] = obj["intensity_1"] * obj["intensity_2"]
	return(obj)
}

reducer = function(prev, next){
	prev["sum_1_m_1"] += next["1_m_1"]
	prev["sum_2_m_2"] += next["2_m_2"]
	prev["sum_1_m_2"] += next["1_m_2"]
	return(prev)

}



// if you have two unit vectors, the dot product is the cosine of the angle between them

///////////////////////////////////////////////////////////////////////////////////////////

// TODO
// calculate binning
// sum up
//

spectrum = [{"mz":1019.74, "intensity": 1},
	{"mz":326.1234, "intensity": 122095.0},
	{"mz":326.1345, "intensity": 111771.0},
	{"mz":326.1232, "intensity": 60817.0}]



f_rounding = function(digits){
	return function(mz){
		return(Math.round(Math.pow(10, digits) * mz) / Math.pow(10, digits))
	}
}

f_rounding_2 = f_rounding(2)
f_rounding_3 = f_rounding(3)


add_rounding = function(obj){
	obj["mz_round"] = f_rounding_2(obj["mz"])
	return(obj)
}

// EXAMPLE BINNED SPECTRA
//
var groupBy = function(data, key) { // `data` is an array of objects, `key` is the key (or property accessor) to group by
	// reduce runs this anonymous function on each element of `data` (the `item` parameter,
	//   // returning the `storage` parameter at the end
	return data.reduce(function(storage, item) {
		//         // get the first instance of the key by which we're grouping
		var group = item[key];
		//                 
		//                     // set `storage` for this instance of group to the outer scope (if not empty) or initialize it
		storage[group] = storage[group] || [];
		//                             
		//                                 // add this item to its group within `storage`
		storage[group].push(item);
		//                                         
		//                                             // return the updated storage to the reduce function, which will then loop through the next 
		return storage; 
	}, {}); // {} is the initial value of the storage
};


grouped_spectrum = groupBy(spectrum.map(add_rounding), "mz_round")

test =   [ { "mz": 326.1234, "intensity": 122095, "mz_round": 326.123 },
	{ "mz": 326.1232, "intensity": 60817, "mz_round": 326.123 } ] 

sum_group = function(prev, next){
	prev["intensity"] += next["intensity"]
	return(prev)

}

//console.log(test.reduce(sum_group, container_summing))

grouping_f = function(list_o){
	/// [ '326.123',
	//  [ { mz: 326.1234, intensity: 122095, mz_round: 326.123 },
	//      { mz: 326.1232, intensity: 60817, mz_round: 326.123 } ] ]
	//
	o_peak = list_o[1].reduce(sum_group, {"intensity": 0})
	o_peak["mz"] = parseFloat(list_o[0])
	return(o_peak)
}
// second element of ever elment is the list of objects. first element just the grouping key

reduce_aligned_spectrum_to_comparison_in = function(prev, next){
	prev["intensity_1"].push(next["intensity_1"])
	prev["intensity_2"].push(next["intensity_2"])
	return(prev)
	// in: [{"intensity_1": 1, "intensity_2": 2}, .....]
}

var ipsa_helper = {
	"binning" :
	f = function(spectrum){
		// summed spectrum by rounding and grouping
		// returns
		// [{"mz": v1, "intensity": v2}, ...]
		grouped_spectrum = groupBy(spectrum.map(add_rounding), "mz_round")
		s = Object.entries(grouped_spectrum).map(grouping_f)
		return(s)
	},
	"aligning" : function(spectrum_1, spectrum_2){
		// aligns two spectra by exptracting "mz"
		// creating unique set of mz ("exact case)

		spectrum_1_simple = spectrum_1.reduce(extract_mz, {})
		spectrum_2_simple = spectrum_2.reduce(extract_mz, {})
		mz_value1 = spectrum_1.map(x => x["mz"])
		mz_value2 = spectrum_2.map(x => x["mz"])
		mz_set = [...new Set(mz_value1.concat(mz_value2))]
		mz_set = mz_value2
		aligned_spectrum = mz_set.map(z) // fill with 0
		aligned_spectrum2 = aligned_spectrum.reduce(reduce_aligned_spectrum_to_comparison_in,{"intensity_1": [], "intensity_2": []})
		return(aligned_spectrum2)
		//		necessary_dot = aligned_spectrum.map(f2 ).reduce(reducer,{"sum_1_m_1" : 0, "sum_2_m_2": 0, "sum_1_m_2" : 0}


	},
	"comparison":{
		// All functions in here must comply to 
		// spectrum_1_intensity = [....]
		// spectrum_2_intensity = [....]
		"dot_product": function(spectrum_1, spectrum_2){
			necessary_dot = aligned_spectrum.map(f2 ).reduce(reducer,{"sum_1_m_1" : 0, "sum_2_m_2": 0, "sum_1_m_2" : 0}
			)
			similarity = necessary_dot["sum_1_m_2"] / Math.sqrt(necessary_dot["sum_1_m_1"] * necessary_dot["sum_2_m_2"] )

			return(similarity)

		},
                "spectral_angle": function(spectrum_1, spectrum_2){
                        necessary_dot = aligned_spectrum.map(f2 ).reduce(reducer,{"sum_1_m_1" : 0, "sum_2_m_2": 0, "sum_1_m_2" : 0}
                        )
                        similarity = necessary_dot["sum_1_m_2"] / Math.sqrt(necessary_dot["sum_1_m_1"] * necessary_dot["sum_2_m_2"] )

                        return(1-(2*Math.acos(similarity))/3.14159265359)

                },
		"euclidean_distance": function(spectrum_1, spectrum_2){
			var rangesum = 0 
  			var sum = 0
  			var n
  			for (n = 0; n < spectrum_1.length; n++) {
  			  sum += Math.pow(spectrum_1[n] - spectrum_2[n], 2)
       			  var values = [spectrum_1[n],spectrum_2[n]]
                          rangesum += Math.pow(Math.max(...values),2)
 			 }
  			return(1-Math.sqrt(sum/rangesum))
		},
                "bray_curtis_distance": function(spectrum_1, spectrum_2){
                        var difference = 0
                        var sum = 0
                        var n
                        for (n = 0; n < spectrum_1.length; n++) {
			  difference += Math.abs(spectrum_1[n] - spectrum_2[n])
                          sum += Math.abs(spectrum_1[n] + spectrum_2[n])
                         }
                        return(1-(difference/sum))
                },
		"pearson_correlation": function(spectrum_1, spectrum_2){
                        var xsum = 0
			var xavg = spectrum_1.reduce((a,b) => a + b, 0) / spectrum_1.length
			var ysum = 0
                        var yavg = spectrum_2.reduce((a,b) => a + b, 0) / spectrum_2.length
                        var sum = 0
                        var n
                        for (n = 0; n < spectrum_1.length; n++) {
			  sum += (spectrum_1[n] - xavg)*(spectrum_2[n] - yavg)
                          xsum += Math.pow((spectrum_1[n] - xavg),2)
                          ysum += Math.pow((spectrum_2[n] - yavg),2)
                         }
                        return(sum/Math.sqrt(xsum*ysum))
		}
	}

}