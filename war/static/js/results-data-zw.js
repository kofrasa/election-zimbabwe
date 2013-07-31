var candidatesInfo = {
	"ZAPU" : {
		color : '#8A5C2E',
		firstName : 'Dumiso',
		lastName : 'Dabengwa',
		fullName : 'Dumiso Dabengwa'
	},
	"ZANU-PF" : {
		color : '#0000FF',
		firstName : 'Robert',
		lastName : 'Mugabe',
		fullName : 'Robert Mugabe'
	},
	"ZDP" : {
		color : '#E4E495',
		firstName : 'Kisinoti',
		lastName : 'Mukwazhe',
		fullName : 'Kisinoti Mukwazhe'
	},
	"MDC" : {
		color : '#20FF20',
		firstName : 'Welshman',
		lastName : 'Ncube',
		fullName : 'Welshman Ncube'
	},
	"MDC-T" : {
		color : '#FF0000',
		firstName : 'Morgan',
		lastName : 'Tsvangirai',
		fullName : 'Morgan Tsvangirai'
	}
};

var geo = {
	"bounds" : {
		"northeast" : {
			"lat" : -15.6093190,
			"lng" : 33.06823570
		},
		"southwest" : {
			"lat" : -22.42452320,
			"lng" : 25.2373680
		}
	},
	"location" : {
		"lat" : -19.0154380,
		"lng" : 29.1548570
	},
	"location_type" : "APPROXIMATE",
	"viewport" : {
		"northeast" : {
			"lat" : -15.6093190,
			"lng" : 33.06823570
		},
		"southwest" : {
			"lat" : -22.42452320,
			"lng" : 25.2373680
		}
	}
};

var g = {
	fontsize : "15px",
	reloadTime : (50 * 1000),
	map : null,
	default_geometry : geo,
	default_style : {
		strokeColor : "#ffffff",
		strokeOpacity : 1,
		strokeWeight : 1,
		fillColor : "#555555",
		fillOpacity : 0.5
	},
	featureArray : [],
	current_geo : null,
	current_province : null,
	current_constituency : null,
	current_ward : null,
	current_level : "provincial",
	region: null,
	jsonLoaded : {
		consituency : false,
		ward : false
	},
	regionCount : {
		"constituency" : 210,
		"provincial" : 10,
		"wards" : 500
	},
	provinceData : {
		MATEBELELAND_NORTH : {
			color : "#996699",
			"geometry" : {
				"bounds" : {
					"northeast" : {
						"lat" : -17.00872570,
						"lng" : 29.22925190
					},
					"southwest" : {
						"lat" : -20.3433250,
						"lng" : 25.2370280
					}
				},
				"location" : {
					"lat" : -18.53315660,
					"lng" : 27.54958460
				},
				"location_type" : "APPROXIMATE",
				"viewport" : {
					"northeast" : {
						"lat" : -17.00872570,
						"lng" : 29.22925190
					},
					"southwest" : {
						"lat" : -20.3433250,
						"lng" : 25.2370280
					}
				}
			},
			constituencies : ['Binga North', 'Binga South', 'Bubi', 'Hwange Central', 'Hwange East', 'Hwange West', 'Lupane East', 'Lupane West', 'Nkayi North', 'Nkayi South', 'Tsholotsho North', 'Tsholotsho South', 'Umguza']
		},
		MIDLANDS : {
			color : "#FFCCFF",
			"geometry" : {
				"bounds" : {
					"northeast" : {
						"lat" : -17.1327980,
						"lng" : 30.85422310
					},
					"southwest" : {
						"lat" : -21.0458690,
						"lng" : 27.9899730
					}
				},
				"location" : {
					"lat" : -19.05520090,
					"lng" : 29.60354950
				},
				"location_type" : "APPROXIMATE",
				"viewport" : {
					"northeast" : {
						"lat" : -17.1327980,
						"lng" : 30.85422310
					},
					"southwest" : {
						"lat" : -21.0458690,
						"lng" : 27.9899730
					}
				}
			},
			constituencies : ['Chirumhanzu-Zibagwe', 'Chirumhanzu', 'Chiwundura', 'Gokwe-Chireya', 'Gokwe-Nembudziya', 'Gokwe-Sengwa', 'Gokwe-Sesame', 'Gokwe', 'Gokwe-Gumunyu', 'Gokwe-Kabuyuni', 'Gokwe Kana', 'Gokwe Mapfungautsi', 'Gweru Urban', 'Kwekwe Central', 'Mberengwa East', 'Mberengwa North', 'Mberengwa South', 'Mberengwa West', 'Mbizo', 'Mkoba', 'Redcliff', 'Shurugwi North', 'Shurugwi South', 'Silobela', 'Vungu', 'Zhombe', 'Zvishavane Ngezi', 'Zvishavane Runde']
		},
		MASHONALAND_WEST : {
			color : "#D8BFD8",
			"geometry" : {
				"bounds" : {
					"northeast" : {
						"lat" : -15.60883410,
						"lng" : 30.9930640
					},
					"southwest" : {
						"lat" : -18.9028020,
						"lng" : 28.0262840
					}
				},
				"location" : {
					"lat" : -17.48510290,
					"lng" : 29.78892480
				},
				"location_type" : "APPROXIMATE",
				"viewport" : {
					"northeast" : {
						"lat" : -15.60883410,
						"lng" : 30.9930640
					},
					"southwest" : {
						"lat" : -18.9028020,
						"lng" : 28.0262840
					}
				}
			},
			constituencies : ['Chakari', 'Chegutu East', 'Chegutu West', 'Chinhoyi', 'Hurungwe Central', 'Hurungwe East', 'Hurungwe North', 'Hurungwe West', 'Kadoma Central', 'Kariba', 'Magunje', 'Makonde', 'Mhangura', 'Mhondoro-Mubhaira', 'Mhondoro-Ngezi', 'Muzvezve', 'Norton', 'Sanyati', 'Zvimba East', 'Zvimba North', 'Zvimba South', 'Zvimba West']
		},
		MASHONALAND_CENTRAL : {
			color : "#F8E5E5",
			"geometry" : {
				"bounds" : {
					"northeast" : {
						"lat" : -15.6175670,
						"lng" : 32.76133510
					},
					"southwest" : {
						"lat" : -17.7441360,
						"lng" : 30.0486390
					}
				},
				"location" : {
					"lat" : -16.76442950,
					"lng" : 31.07937050
				},
				"location_type" : "APPROXIMATE",
				"viewport" : {
					"northeast" : {
						"lat" : -15.6175670,
						"lng" : 32.76133510
					},
					"southwest" : {
						"lat" : -17.7441360,
						"lng" : 30.0486390
					}
				}
			},
			constituencies : ['Bindura North', 'Bindura South', 'Guruve North', 'Guruve South', 'Mazowe Central', 'Mazowe North', 'Mazowe South', 'Mazowe West', 'Mbire', 'Mt Darwin East', 'Mt Darwin North', 'Mt Darwin South', 'Mt Darwin West', 'Muzarabani North', 'Muzarabani South', 'Rushinga', 'Shamva North', 'Shamva South']
		},
		BULAWAYO : {
			color : "#0FF5EE",
			"geometry" : {
				"bounds" : {
					"northeast" : {
						"lat" : -19.99206280,
						"lng" : 28.76323720
					},
					"southwest" : {
						"lat" : -20.27122780,
						"lng" : 28.42700960
					}
				},
				"location" : {
					"lat" : -20.172190,
					"lng" : 28.581160
				},
				"location_type" : "APPROXIMATE",
				"viewport" : {
					"northeast" : {
						"lat" : -19.99206280,
						"lng" : 28.76323720
					},
					"southwest" : {
						"lat" : -20.27122780,
						"lng" : 28.42700960
					}
				}
			},
			constituencies : ['Bulawayo Central', 'Bulawayo East', 'Bulawayo South', 'Emakhandeni-Entumbane', 'Lobengula', 'Luveve', 'Magwegwe', 'Makokoba', 'Nketa', 'Nkulumane', 'Pelandaba-Mpopoma', 'Pumula']
		},
		MATEBELELAND_SOUTH : {
			color : "#FFE4E1",
			"geometry" : {
				"bounds" : {
					"northeast" : {
						"lat" : -19.482620,
						"lng" : 31.11489490
					},
					"southwest" : {
						"lat" : -22.3510740,
						"lng" : 26.69824390
					}
				},
				"location" : {
					"lat" : -21.0523370,
					"lng" : 29.04599270
				},
				"location_type" : "APPROXIMATE",
				"viewport" : {
					"northeast" : {
						"lat" : -19.482620,
						"lng" : 31.11489490
					},
					"southwest" : {
						"lat" : -22.3510740,
						"lng" : 26.69824390
					}
				}
			},
			constituencies : [ 'Beitbridge East', 'Beitbridge West', 'Bulilima East', 'Bulilima West', 'Gwanda Central', 'Gwanda North', 'Gwanda South', 'Insiza North', 'Insiza South', 'Mangwe', 'Matobo North', 'Matobo South', 'Umzingwane' ]
		},
		MASVINGO : {
			color : "#B0C4DE",
			"geometry" : {
	            "bounds" : {
	               "northeast" : {
	                  "lat" : -19.114029, //-20.03771790,
	                  "lng" : 32.44091 //30.86741769999999
	               },
	               "southwest" : {
	                  "lat" : -22.43134, //-20.10768430,
	                  "lng" : 29.74926 //30.79326040
	               }
	            },
	            "location" : {
	               "lat" : -20.735566, // -20.07444440,
	               "lng" : 31.27636 //30.83277780
	            },
	            "location_type" : "APPROXIMATE",
	            "viewport" : {
	               "northeast" : {
	                  "lat" : -20.03771790,
	                  "lng" : 30.86741769999999
	               },
	               "southwest" : {
	                  "lat" : -20.10768430,
	                  "lng" : 30.79326040
	               }
	            }
	         },
			constituencies : ['Bikita East', 'Bikita South', 'Bikita West', 'Chiredzi East', 'Chiredzi North', 'Chiredzi South', 'Chiredzi West', 'Chivi Central', 'Chivi North', 'Chivi South', 'Gutu Central', 'Gutu East', 'Gutu North', 'Gutu South', 'Gutu West', 'Masvingo Central', 'Masvingo North', 'Masvingo South', 'Masvingo Urban', 'Masvingo West', 'Mwenezi East', 'Mwenezi West', 'Zaka Central', 'Zaka East', 'Zaka North', 'Zaka West']
		},
		MASHONALAND_EAST : {
			color : "#E0FFFF",
			"geometry" : {
				"bounds" : {
					"northeast" : {
						"lat" : -16.688817,
						"lng" : 32.99466590
					},
					"southwest" : {
						"lat" : -19.27124610,
						"lng" : 30.4858930
					}
				},
				"location" : {
					"lat" : -17.895114,
					"lng" : 31.660881
				},
				"location_type" : "APPROXIMATE",
				"viewport" : {
					"northeast" : {
						"lat" : -16.69893990,
						"lng" : 32.99466590
					},
					"southwest" : {
						"lat" : -19.27124610,
						"lng" : 30.4858930
					}
				}
			},
			constituencies : ['Chikomba Central', 'Chikomba East', 'Chikomba West', 'Goromonzi North', 'Goromonzi South', 'Goromonzi West', 'Maramba-Pfungwe', 'Marondera Central', 'Marondera East', 'Marondera West', 'Mudzi North', 'Mudzi South', 'Mudzi West', 'Murehwa North', 'Murehwa South', 'Murehwa West', 'Mutoko East', 'Mutoko North', 'Mutoko South', 'Seke', 'Uzumba', 'Wedza North', 'Wedza South']
		},
		MANICALAND : {
			color : "#B8860B",
			"geometry" : {
				"bounds" : {
					"northeast" : {
						"lat" : -17.2505810,
						"lng" : 33.05630490
					},
					"southwest" : {
						"lat" : -21.3281120,
						"lng" : 31.23346299999999
					}
				},
				"location" : {
					"lat" : -18.92163860,
					"lng" : 32.1746050
				},
				"location_type" : "APPROXIMATE",
				"viewport" : {
					"northeast" : {
						"lat" : -17.2505810,
						"lng" : 33.05630490
					},
					"southwest" : {
						"lat" : -21.3281120,
						"lng" : 31.23346299999999
					}
				}
			},
			constituencies : ['Buhera Central', 'Buhera North', 'Buhera South', 'Buhera West', 'Chimanimani East', 'Chimanimani West', 'Chipinge Central', 'Chipinge East', 'Chipinge South', 'Chipinge West', 'Dangamvura-Chikanga', 'Headlands', 'Makoni Central', 'Makoni North', 'Makoni South', 'Makoni West', 'Musikavanhu', 'Mutare Central', 'Mutare North', 'Mutare South', 'Mutare West', 'Mutasa Central', 'Mutasa North', 'Mutasa South', 'Nyanga North', 'Nyanga South']
		},
		HARARE : {
			color : "#F07C2F",
			"geometry" : {
				"bounds" : {
					"northeast" : {
						"lat" : -17.67755420,
						"lng" : 31.22468130
					},
					"southwest" : {
						"lat" : -17.9557210,
						"lng" : 30.88903520
					}
				},
				"location" : {
					"lat" : -17.829220,
					"lng" : 31.0539610
				},
				"location_type" : "APPROXIMATE",
				"viewport" : {
					"northeast" : {
						"lat" : -17.67755420,
						"lng" : 31.22468130
					},
					"southwest" : {
						"lat" : -17.9557210,
						"lng" : 30.88903520
					}
				}
			},
			constituencies : ['Budiriro', 'Chitungwiza North', 'Chitungwiza South', 'Dzivaresekwa', 'Epworth', 'Glen Norah', 'Glen View South', 'Glenview North', 'Harare Central', 'Harare East', 'Harare North', 'Harare South', 'Harare West', 'Hatfield', 'Highfield East', 'Highfield West', 'Kambuzuma', 'Kuwadzana', 'Kuwadzana East', 'Mabvuku-Tafara', 'Mbare', 'Mt Pleasant', 'Mufakose', 'Southerton', "St Mary's", 'Sunningdale', 'Warren Park', 'Zengeza East', 'Zengeza West']
		}
	}
};

function strictCandidateSort(candidates) {
	var positions = [ 'NDC', 'GCPP', 'NPP', 'PPP', 'UFP', 'PNC', 'CPP' ];
	var candidatesSortedStrict = [];
	var added;

	for ( var i = 0; i < positions.length; i++) {
		for ( var j = 0; j < candidates.length; j++) {
			if (positions[i] === candidates[j].party) {
				candidatesSortedStrict.push(candidates[j]);
				break;
			}
		}
	}

	var added;
	for ( var j = 0; j < candidates.length; j++) {
		added = false;
		for ( var i = 0; i < candidatesSortedStrict.length; i++) {
			if (candidates[j].party === candidatesSortedStrict[i].party) {
				added = true;
				break;
			}
		}
		if (!added) {
			candidatesSortedStrict.push(candidates[j]);
		}
	}

	return candidatesSortedStrict;
}

function Candidate(party, constituency, votes) {
	this.party = party || '';
	this.constituency = constituency || 'Ghana';
	this.votes = votes || 0;
	this.vsAll = null;
	this.vsTop = null;

	if (candidatesInfo[party] == null) {
		this.color = g.default_style.fillColor;
	} else {
		this.color = candidatesInfo[party].color;
	}
}

function convertToCandidates(json) {
	var candidates = [];
	for ( var k in json) {
		candidates.push(new Candidate(k, null, json[k]));

	}
	return candidates;
}

function getTopCandidates(candidates, sortBy, max) {
	max = max || Infinity;
	if (!candidates)
		return [];

	// Clone the candidate list
	var top = [];
	// TODO(mg): It's possible at this point that result.candidates is either
	// an object, or an array. This next bit is a total kludge.
	// Note: experimenting with clone vs. shallow reference
	if (candidates.length) {
		for ( var i = 0; i < candidates.length; i++) {
			top.push(_.clone(candidates[i]));
		}
	} else {
		// It's a map, treat it as such:
		for ( var name in candidates) {
			top.push(_.clone(candidates[name]));
		}
	}

	var total = {
		votes : 0,
		electoralVotes : 0
	};

	// Use trends data if applicable, and calculate total votes
	_.each(top, function(candidate) {
		// if( params.contest == 'president' )
		// setCandidateTrendsVotes( result.id, candidate, sortBy );
		total.votes += candidate.votes;
	});

	// Calculate the relative fractions now that the total is available
	_.each(top, function(candidate) {

		candidate.vsAll = candidate.votes / total.votes;
	});

	// Sort by a specified property and then by votes, or just by votes
	var sorter = sortBy;
	if (sortBy != 'votes') {
		sorter = function(candidate) {
			var ev = candidate[sortBy] || 0;
			if (isNaN(ev))
				ev = 0; // temp workaround it should not be NaN
			return (ev * 1000000000) + candidate.votes;
		};
	}
	top = sortArrayBy(top, sorter, {
		numeric : true
	});

	// Sort in descending order and trim
	top = top.reverse().slice(0, max);
	// while( top.length && ! top[top.length-1].votes && top.length >= 9)
	// top.pop();

	// Finally can compare each candidate with the topmost
	if (top.length) {
		var most = top[0].votes;
		_.each(top, function(candidate) {
			candidate.vsTop = candidate.votes / most;
		});
	}

	// top = strictCandidateSort(top);

	return top;
}