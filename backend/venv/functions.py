import math,time
from math import radians, cos, sin, asin, sqrt

#calculating distance between two points

def distance_calculator(x,y) :
    x1 = x[0]
    y1 = x[1]
    x2 = y[0]
    y2 = y[1]
    distance = math.sqrt((x2-x1)**2 + (y2-y1)**2)
    return distance

#for testing

user_location = [5,5]
driver_locations = [[1,3],[5,7],[2,4],[3,9],[4,6],[5,7],[6,2],[7,3],[8,10],[8,4]]

#picking the driver with the shortest distance

def pick_best_ride(available_rides, driver_location) :
    best_driver_index = 0
    best_distance = 10000
    for index in range(len(available_rides)) :
        distance = distance_calculator(available_rides[index][1], user_location)
        if(distance < best_distance) :
            best_distance = distance
            best_driver_index = index
        
    return best_driver_index

#getting path between two points for testing purpose
"""
def get_path(current_loc, end_loc) :
        if(current_loc[0] != end_loc[0] and current_loc[1] != end_loc[1]) :
            while(current_loc[0] < end_loc[0] and current_loc[1] < end_loc[1]) :
                current_loc[0] += 1
                current_loc[1] += 1
                time.sleep(1)
                print_distance(current_loc,end_loc)
            while(current_loc[0] > end_loc[0] and current_loc[1] > end_loc[1]) :
                current_loc[0] -= 1
                current_loc[1] -= 1
                time.sleep(1)
                print_distance(current_loc,end_loc)
        while(current_loc[0] < end_loc[0] and current_loc[1] > end_loc[1]) :
            current_loc[0] += 1
            current_loc[1] -= 1
            time.sleep(1)
            print_distance(current_loc,end_loc)
        while(current_loc[0] > end_loc[0] and current_loc[1] < end_loc[1]) :
            current_loc[0] -= 1
            current_loc[1] += 1
            time.sleep(1)
            print(current_loc, distance_calculator(current_loc,end_loc)*200,"meters away")
        if(current_loc[0] < end_loc[0]):
            while(current_loc[0] != end_loc[0]) :
                current_loc[0] += 1
                time.sleep(1)
                print(current_loc, distance_calculator(current_loc,end_loc)*200,"meters away")
        else :
            while(current_loc[0] != end_loc[0]) :
                current_loc[0] -= 1
                time.sleep(1)
                print(current_loc, distance_calculator(current_loc,end_loc)*200,"meters away")
        if(current_loc[1] < end_loc[1]):
            while(current_loc[1] != end_loc[1]) :
                current_loc[1] += 1
                time.sleep(1)
                print(current_loc, distance_calculator(current_loc,end_loc)*200,"meters away")
        else :
            while(current_loc[1] != end_loc[1]) :
                current_loc[1] -= 1
                time.sleep(1)
                print(current_loc, distance_calculator(current_loc,end_loc)*200,"meters away")
        return current_loc
"""

#calculating distance using haversine formula

def distance(lat1, lat2, lon1, lon2):
    
    # radians which converts from degrees to radians.
    lon1 = radians(lon1)
    lon2 = radians(lon2)
    lat1 = radians(lat1)
    lat2 = radians(lat2)
      
    # Haversine formula
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
 
    c = 2 * asin(sqrt(a))
    
    # Radius of earth in kilometers
    r = 6371
      
    # calculate the result
    return(c * r)